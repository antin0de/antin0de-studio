package models

import (
	"time"

	"github.com/google/uuid"
)

type TaskRun struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4()"`
	TaskID    uuid.UUID `json:"taskId"`
	Task      Task      `json:"task"`
	Status    string    `json:"status"`
	Log       string    `json:"log"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
