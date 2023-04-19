package handlers

import (
	"net/http"

	"antin0.de/studio/helpers"
	"antin0.de/studio/models"
	"github.com/gin-gonic/gin"
)

type CreateServiceRequestBody struct {
	FQDN     string `json:"fqdn" binding:"required"`
	Protocol string `json:"protocol" binding:"required"`
	Port     uint64 `json:"port" binding:"required"`
	Name     string `json:"name" binding:"required"`
}

// Create a new service, will do nothing if the service already exists
// POST /v1/services
func (h *HandlerParams) CreateService() gin.HandlerFunc {
	return func(c *gin.Context) {
		var request CreateServiceRequestBody
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if !helpers.IsAuthenticated(c) {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		var domain models.Domain
		result := h.Db.Where("fqdn = ?", request.FQDN).First(&domain)
		// If domain doesn't exist, throw an error
		if result.RowsAffected == 0 {
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}

		var service models.Service
		result = h.Db.Where("domain_id =? and name =? and protocol =? and port =?", domain.ID, request.Name, request.Protocol, request.Port).First(&service)
		// If service doesn't exist, create it
		if result.RowsAffected == 0 {
			service = models.Service{
				DomainID: domain.ID,
				Protocol: request.Protocol,
				Port:     request.Port,
				Name:     request.Name,
			}
			result = h.Db.Create(&service)
			if result.Error != nil {
				c.AbortWithStatus(http.StatusInternalServerError)
				return
			}
		}

		c.JSON(200, gin.H{
			"id": service.ID,
		})
	}
}
