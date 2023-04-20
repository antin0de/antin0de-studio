package main

import (
	"log"
	"os"

	"antin0.de/studio-runner/api"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	apiEndpoint := os.Getenv("ANTIN0DE_STUDIO_API_ENDPOINT")
	apiPassword := os.Getenv("ANTIN0DE_STUDIO_API_PASSWORD")

	api := api.ApiParams{ApiEndpoint: apiEndpoint, ApiPassword: apiPassword}
}
