package handlers

import (
	"net/http"

	"antin0.de/studio/helpers"
	"antin0.de/studio/models"
	"github.com/gin-gonic/gin"
)

type CreateDomainRequestBody struct {
	FQDN string `json:"fqdn" binding:"required"`
}

// Create a new domain, will do nothing if the domain already exists
// POST /v1/domains
func (h *HandlerParams) CreateDomain() gin.HandlerFunc {
	return func(c *gin.Context) {
		var request CreateDomainRequestBody
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if !helpers.IsAuthenticated(c) {
			c.AbortWithStatus(401)
		}

		var domain models.Domain
		result := h.Db.Where("fqdn = ?", request.FQDN).First(&domain)
		// If domain doesn't exist, create it
		if result.RowsAffected == 0 {
			domain = models.Domain{
				FQDN: request.FQDN,
			}
			h.Db.Create(&domain)
		}

		c.JSON(200, gin.H{
			"id": domain.ID,
		})
	}
}

// List all domains
// GET /v1/domains
func (h *HandlerParams) ListDomains() gin.HandlerFunc {
	return func(c *gin.Context) {
		var request CreateDomainRequestBody
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if !helpers.IsAuthenticated(c) {
			c.AbortWithStatus(401)
		}

		var domains []models.Domain
		result := h.Db.Find(&domains)
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"domains": domains,
		})
	}
}
