package main

import (
	"imbored/internal/server"
	"log"
)

func main() {
	settings := server.Settings{
		Endpoint: "localhost:8080",
	}

	srv := server.New()
	if err := srv.Run(settings); err != nil {
		log.Fatal(err)
	}
}
