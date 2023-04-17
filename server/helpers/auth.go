package helpers

import (
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

/**
 * Check to see if a context is authenticated, returns true if it is
 * this will not send 401 response.
 */
func IsAuthenticated(c *gin.Context) bool {
	session := sessions.Default(c)
	loggedin := session.Get("loggedin")
	if loggedin == true {
		return true
	}
	password := c.Query("password")
	return password == os.Getenv("MASTER_PASSWORD")
}
