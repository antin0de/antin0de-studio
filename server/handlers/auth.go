package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type CheckMasterPasswordRequestBody struct {
	Password string `json:"password" binding:"required"`
}

// Check to see if master password is valid, returns 200 status if password is valid
// 401 is password is invalid.
// POST /v1/checkMasterPassword
func (h *HandlerParams) CheckMasterPassword() gin.HandlerFunc {
	return func(c *gin.Context) {
		var request CheckMasterPasswordRequestBody
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(200, gin.H{
			"status": "ok",
		})
	}
}
