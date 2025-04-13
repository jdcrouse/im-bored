package server

import (
	"encoding/json"
	"fmt"
	"imbored/internal/user"
	"io"
	"log"
	"net/http"
	"strings"
	"sync"
)

type Settings struct {
	Endpoint        string
	Port            string
	SupabaseAnonKey string
	SupabaseURL     string
}

type Server struct {
	registeredUsers map[string]*user.User
	mu              sync.RWMutex
	settings        Settings
}

func New(settings Settings) *Server {
	return &Server{
		registeredUsers: make(map[string]*user.User),
		settings:        settings,
	}
}

type Response struct {
	Message string `json:"message"`
}

type UsersResponse struct {
	Users []string `json:"users"`
}

type NotifyAllRequest struct {
	NotifierID string `json:"notifier_id"`
}

func (s *Server) authenticateRequest(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		// Extract the token from the "Bearer <token>" format
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
			return
		}

		tokenString := tokenParts[1]

		// Call Supabase's user endpoint to validate token and get user info
		req, err := http.NewRequest("GET", fmt.Sprintf("%s/auth/v1/user", s.settings.SupabaseURL), nil)
		if err != nil {
			http.Error(w, "Failed to create request", http.StatusInternalServerError)
			return
		}

		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", tokenString))
		req.Header.Set("apikey", s.settings.SupabaseAnonKey)

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			http.Error(w, "Failed to validate token", http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Parse the response to get user info
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			http.Error(w, "Failed to read response", http.StatusInternalServerError)
			return
		}

		var userData struct {
			ID string `json:"id"`
		}
		if err := json.Unmarshal(body, &userData); err != nil {
			http.Error(w, "Failed to parse user data", http.StatusInternalServerError)
			return
		}

		// Add user ID to request context
		r.Header.Set("X-User-ID", userData.ID)

		log.Printf("Successfully authenticated user %s", userData.ID)
		next.ServeHTTP(w, r)
	}
}

func (s *Server) handleRegisterUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		http.Error(w, "User ID not found", http.StatusBadRequest)
		return
	}

	user := &user.User{Name: userID}

	s.mu.Lock()
	s.registeredUsers[userID] = user
	s.mu.Unlock()

	response := Response{Message: "Registration successful for ID: " + userID}
	json.NewEncoder(w).Encode(response)
}

func (s *Server) handleListUsers(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received request to /users")
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	s.mu.RLock()
	users := make([]string, 0, len(s.registeredUsers))
	for id := range s.registeredUsers {
		users = append(users, id)
	}
	s.mu.RUnlock()

	log.Printf("Returning %d users", len(users))
	response := UsersResponse{Users: users}
	json.NewEncoder(w).Encode(response)
}

func (s *Server) handleNotifyAllUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		http.Error(w, "User ID not found", http.StatusBadRequest)
		return
	}

	s.mu.RLock()
	users := make([]*user.User, 0, len(s.registeredUsers))
	for _, user := range s.registeredUsers {
		users = append(users, user)
	}
	s.mu.RUnlock()

	for _, user := range users {
		user.Notify()
	}

	response := Response{Message: fmt.Sprintf("%s broadcasted boredom", userID)}
	json.NewEncoder(w).Encode(response)
}

func (s *Server) Run() error {
	// Wrap handlers with authentication middleware
	http.HandleFunc("/register", s.authenticateRequest(s.handleRegisterUser))
	http.HandleFunc("/users", s.authenticateRequest(s.handleListUsers))
	http.HandleFunc("/broadcast-boredom", s.authenticateRequest(s.handleNotifyAllUsers))
	http.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	address := fmt.Sprintf("%s:%s", s.settings.Endpoint, s.settings.Port)
	log.Printf("starting server on %s", address)
	return http.ListenAndServe(address, nil)
}

func Run(settings Settings) error {
	srv := New(settings)
	return srv.Run()
}
