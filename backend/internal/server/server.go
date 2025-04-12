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

func (s *Server) registerHandler(w http.ResponseWriter, r *http.Request) {
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

func (s *Server) notifyHandler(w http.ResponseWriter, r *http.Request) {
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

func (s *Server) Run(settings Settings) error {
	http.HandleFunc("/register", s.registerHandler)
	http.HandleFunc("/notify", s.notifyHandler)
	log.Printf("Server starting on %s...", settings.Endpoint)
	return http.ListenAndServe(settings.Endpoint, nil)
}
