package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Get banner
// GET /
func (h *HandlerParams) GetBanner() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.String(http.StatusOK, `Welcome to Antin0de Studio.
		_____          __  .__       _______       .___         _________ __            .___.__        
		/  _  \   _____/  |_|__| ____ \   _  \    __| _/____    /   _____//  |_ __ __  __| _/|__| ____  
	   /  /_\  \ /    \   __\  |/    \/  /_\  \  / __ |/ __ \   \_____  \\   __\  |  \/ __ | |  |/  _ \ 
	  /    |    \   |  \  | |  |   |  \  \_/   \/ /_/ \  ___/   /        \|  | |  |  / /_/ | |  (  <_> )
	  \____|__  /___|  /__| |__|___|  /\_____  /\____ |\___  > /_______  /|__| |____/\____ | |__|\____/ 
			  \/     \/             \/       \/      \/    \/          \/                 \/            `)
	}
}
