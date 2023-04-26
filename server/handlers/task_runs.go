package handlers

import (
	"net/http"

	"antin0.de/studio/helpers"
	"antin0.de/studio/models"
	"github.com/gin-gonic/gin"
)

type DequeueTaskRunRequestBody struct {
	Tags         []string `json:"tags"`
	SetAsRunning bool     `json:"setAsRunning"`
}

// Dequeue a task run from the queue
// POST /v1/task_runs/dequeue
// If setAsRunning is true, the task run will be set as running, useful for
// an atomic dequeue operation.
func (h *HandlerParams) DequeueTaskRun() gin.HandlerFunc {
	return func(c *gin.Context) {
		var request DequeueTaskRunRequestBody
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if !helpers.IsAuthenticated(c) {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		var taskRun models.TaskRun
		result := h.Db.Where("status =?", "PENDING").Order("created_at").Preload("Task").First(&taskRun)

		if result.RowsAffected == 0 {
			c.JSON(200, gin.H{
				"taskRun": nil,
			})
		} else {
			if request.SetAsRunning {
				taskRun.Status = "RUNNING"
				h.Db.Save(&taskRun)
			}
			c.JSON(200, gin.H{
				"taskRun": taskRun,
			})
		}
	}
}

type UpdateTaskRunRequestBody struct {
	Status      string `json:"status"`
	RunDuration int64  `json:"runDuration"`
	Log         string `json:"log"`
}

// Update a task run
// PUT /v1/task_runs/:taskRunId
func (h *HandlerParams) UpdateTaskRun() gin.HandlerFunc {
	return func(c *gin.Context) {
		var request UpdateTaskRunRequestBody
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if !helpers.IsAuthenticated(c) {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		taskRunId := c.Param("taskRunId")
		var taskRun models.TaskRun
		result := h.Db.Where("id =?", taskRunId).First(&taskRun)
		if result.RowsAffected == 0 {
			c.AbortWithStatus(http.StatusNotFound)
			return
		}

		taskRun.Status = request.Status
		taskRun.RunDuration = request.RunDuration
		taskRun.Log = request.Log
		h.Db.Save(&taskRun)

		c.JSON(200, gin.H{
			"id": taskRun.ID,
		})
	}
}
