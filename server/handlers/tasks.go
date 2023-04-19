package handlers

import (
	"net/http"

	"antin0.de/studio/helpers"
	"antin0.de/studio/models"
	"github.com/gin-gonic/gin"
)

type CreateTaskRequestBody struct {
	Name         string `json:"name"`
	TaskType     string `json:"taskType"`
	TaskConfig   string `json:"taskConfig"`
	CronSchedule string `json:"cronSchedule"`
}

// Create a new task
// POST /v1/tasks
func (h *HandlerParams) CreateTask() gin.HandlerFunc {
	return func(c *gin.Context) {
		var request CreateTaskRequestBody
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if !helpers.IsAuthenticated(c) {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		if !helpers.IsValidTaskType(request.TaskType) {
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}
		if !helpers.IsValidCronExpression(request.CronSchedule) {
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}

		var task = models.Task{
			Name:         request.Name,
			TaskType:     request.TaskType,
			TaskConfig:   request.TaskConfig,
			CronSchedule: request.CronSchedule,
		}

		result := h.Db.Create(&task)
		if result.Error != nil {
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		helpers.ScheduleTask(task, h.CronInstance, h.TaskToCronEntryMap, h.Db)

		c.JSON(200, gin.H{
			"id": task.ID,
		})
	}
}

// Delete task
// DELETE /v1/tasks/:taskId
func (h *HandlerParams) DeleteTask() gin.HandlerFunc {
	return func(c *gin.Context) {
		if !helpers.IsAuthenticated(c) {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		taskId := c.Param("taskId")
		var task models.Task
		result := h.Db.Where("id =?", taskId).First(&task)
		if result.RowsAffected == 0 {
			c.AbortWithStatus(http.StatusNotFound)
			return
		}
		h.Db.Delete(&task)

		helpers.UnscheduleTask(task, h.CronInstance, h.TaskToCronEntryMap)

		c.JSON(200, gin.H{
			"id": task.ID,
		})
	}
}

type UpdateTaskRequestBody struct {
	Name         string `json:"name"`
	TaskType     string `json:"taskType"`
	TaskConfig   string `json:"taskConfig"`
	CronSchedule string `json:"cronSchedule"`
}

// Update task
// PUT /v1/tasks/:taskId
func (h *HandlerParams) UpdateTask() gin.HandlerFunc {
	return func(c *gin.Context) {
		var request UpdateTaskRequestBody
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if !helpers.IsAuthenticated(c) {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		if !helpers.IsValidTaskType(request.TaskType) {
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}
		if !helpers.IsValidCronExpression(request.CronSchedule) {
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}

		taskId := c.Param("taskId")
		var task models.Task
		result := h.Db.Where("id =?", taskId).First(&task)
		if result.RowsAffected == 0 {
			c.AbortWithStatus(http.StatusNotFound)
			return
		}

		task.Name = request.Name
		task.TaskType = request.TaskType
		task.TaskConfig = request.TaskConfig
		task.CronSchedule = request.CronSchedule
		h.Db.Save(&task)

		helpers.ScheduleTask(task, h.CronInstance, h.TaskToCronEntryMap, h.Db)

		c.JSON(200, gin.H{
			"id": task.ID,
		})
	}
}

// List all tasks
// GET /v1/tasks
func (h *HandlerParams) ListTasks() gin.HandlerFunc {
	return func(c *gin.Context) {
		var tasks []models.Task
		result := h.Db.Order("created_at").Find(&tasks)
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}

		c.JSON(200, gin.H{
			"tasks": tasks,
		})
	}
}
