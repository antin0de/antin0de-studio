package main

import (
	"log"

	"antin0.de/studio/handlers"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	r := gin.Default()
	db := ConnectAndMigrateDatabase()

	h := handlers.HandlerParams{Db: db}

	// Routes
	r.POST("/v1/checkMasterPasssword", h.CheckMasterPassword())

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
