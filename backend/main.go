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
	godotenv.Load()

	port, ok := os.LookupEnv("PORT")
	if !ok {
		port = DEFAULT_PORT
	}

	settings := server.Settings{
		Endpoint: os.Getenv("ENDPOINT"), // if no endpoint variable is provided, defaults to "" which is localhost
		Port:     port,
	}

	srv := server.New()
	if err := srv.Run(settings); err != nil {
		log.Fatal(err)
	}
}
