package server

import (
	"encoding/json"
	"imbored/internal/user"
	"log"
	"net/http"
	"sync"
)

type Settings struct {
	Endpoint string
}

type Server struct {
	registeredUsers map[string]*user.User
	mu              sync.RWMutex
}

func New() *Server {
	return &Server{
		registeredUsers: make(map[string]*user.User),
	}
}

type Response struct {
	Message string `json:"message"`
}

type UsersResponse struct {
	Users []string `json:"users"`
}

func (s *Server) handleRegisterUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "ID is required", http.StatusBadRequest)
		return
	}

	user := &user.User{Name: id}

	s.mu.Lock()
	s.registeredUsers[id] = user
	s.mu.Unlock()

	response := Response{Message: "Registration successful for ID: " + id}
	json.NewEncoder(w).Encode(response)
}

func (s *Server) handleNotifyUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "ID is required", http.StatusBadRequest)
		return
	}

	s.mu.RLock()
	user, exists := s.registeredUsers[id]
	s.mu.RUnlock()

	if !exists {
		http.Error(w, "ID not registered", http.StatusNotFound)
		return
	}

	user.Notify()
	response := Response{Message: "Notification sent for ID: " + id}
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

func (s *Server) Run(settings Settings) error {
	http.HandleFunc("/register", s.handleRegisterUser)
	http.HandleFunc("/notify", s.handleNotifyUser)
	http.HandleFunc("/users", s.handleListUsers)
	return http.ListenAndServe(settings.Endpoint, nil)
}
