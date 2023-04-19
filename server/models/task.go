package models

import (
	"time"

	"github.com/google/uuid"
)

type Task struct {
	ID           uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4()"`
	Name         string    `json:"name"`
	TaskType     string    `json:"taskType"`
	TaskConfig   string    `json:"taskConfig"`
	CronSchedule string    `json:"cronSchedule"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}
