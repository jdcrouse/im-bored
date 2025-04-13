package main

import (
	"imbored/internal/server"
	"log"
	"os"

	"github.com/joho/godotenv"
)

const (
	DEFAULT_PORT = "8080"
)

func main() {
	godotenv.Load() // environment variables will override values from .env

	port, ok := os.LookupEnv("PORT")
	if !ok {
		port = DEFAULT_PORT
	}

	supabaseAnonKey := os.Getenv("SUPABASE_ANON_KEY")
	if supabaseAnonKey == "" {
		log.Fatal("SUPABASE_ANON_KEY environment variable is required")
	}

	supabaseURL := os.Getenv("SUPABASE_URL")
	if supabaseURL == "" {
		log.Fatal("SUPABASE_URL environment variable is required")
	}

	settings := server.Settings{
		Endpoint:        os.Getenv("ENDPOINT"), // if no endpoint variable is provided, defaults to "" which is localhost
		Port:            port,
		SupabaseAnonKey: supabaseAnonKey,
		SupabaseURL:     supabaseURL,
	}

	if err := server.Run(settings); err != nil {
		log.Fatal(err)
	}
}
