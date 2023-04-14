package handlers

import (
	"net/http"
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

type LoginRequestBody struct {
	Password string `json:"password" binding:"required"`
}

// Check to see if master password is valid, and authenticates current session
// POST /v1/login
func (h *HandlerParams) Login() gin.HandlerFunc {
	return func(c *gin.Context) {
		var request LoginRequestBody
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		password := os.Getenv("MASTER_PASSWORD")
		if request.Password != password {
			c.JSON(401, gin.H{
				"message": "Invalid master password",
			})
			return
		}

		session := sessions.Default(c)
		session.Set("loggedin", true)
		session.Save()
		c.JSON(200, gin.H{
			"status": "ok",
		})
	}
}

// Check to see if user is logged in or not, always return 200
// GET /v1/loginStatus
func (h *HandlerParams) LoginStatus() gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		loggedin := session.Get("loggedin")
		if loggedin == nil || loggedin == false {
			c.JSON(200, gin.H{
				"loggedin": false,
			})
			return
		} else {
			c.JSON(200, gin.H{
				"loggedin": true,
			})
		}
	}
}

// Logout, always return 200, will invalidate current session
// POST /v1/logout
func (h *HandlerParams) Logout() gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		session.Clear()
		session.Save()
		c.JSON(200, gin.H{
			"status": "ok",
		})
	}
}
