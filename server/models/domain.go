package models

import (
	"time"

	"github.com/google/uuid"
)

type Domain struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4()"`
	FQDN      string    `json:"fqdn"`
	Services  []Service `json:"services"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
