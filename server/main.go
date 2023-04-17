package main

import (
	"log"
	"os"

	"antin0.de/studio/handlers"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	r := gin.Default()

	// Setup sessions with cookie store
	cookieSecret := os.Getenv("COOKIE_SECRET")
	store := cookie.NewStore([]byte(cookieSecret))
	r.Use(sessions.Sessions("session", store))

	db := ConnectAndMigrateDatabase()

	h := handlers.HandlerParams{Db: db}

	// Routes
	r.POST("/v1/login", h.Login())
	r.GET("/v1/loginStatus", h.LoginStatus())
	r.POST("/v1/logout", h.Logout())
	r.POST("/v1/domains", h.CreateDomain())
	r.GET("/v1/domains", h.ListDomains())

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
