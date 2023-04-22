package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Get banner
// GET /
func (h *HandlerParams) GetBanner() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.String(http.StatusOK, `Welcome to Antin0de Studio. Find the source at https://github.com/antin0de/antin0de-studio`)
	}
}
