package main

import (
	"log"
	"os"

	"antin0.de/studio/handlers"
	"antin0.de/studio/helpers"
	"antin0.de/studio/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/robfig/cron/v3"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	// Setup sessions with cookie store
	cookieSecret := os.Getenv("COOKIE_SECRET")
	store := cookie.NewStore([]byte(cookieSecret))
	r.Use(sessions.Sessions("session", store))

	db := ConnectAndMigrateDatabase()

	taskToCronEntryMap := make(map[string]cron.EntryID)
	// Get all tasks
	var tasks []models.Task
	result := db.Find(&tasks)
	if result.Error != nil {
		panic(result.Error)
	}
	c := cron.New()
	for _, task := range tasks {
		helpers.ScheduleTask(task, c, &taskToCronEntryMap, db)
	}
	c.Start()

	h := handlers.HandlerParams{Db: db, CronInstance: c, TaskToCronEntryMap: &taskToCronEntryMap}

	// Routes
	r.POST("/v1/login", h.Login())
	r.GET("/v1/loginStatus", h.LoginStatus())
	r.POST("/v1/logout", h.Logout())
	r.POST("/v1/domains", h.CreateDomain())
	r.GET("/v1/domains", h.ListDomains())
	r.POST("/v1/services", h.CreateService())
	r.POST("/v1/tasks", h.CreateTask())
	r.GET("/v1/tasks", h.ListTasks())
	r.GET("/v1/tasks/:taskId", h.GetTask())
	r.PUT("/v1/tasks/:taskId", h.UpdateTask())
	r.DELETE("/v1/tasks/:taskId", h.DeleteTask())

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
