package models

import (
	"time"

	"github.com/google/uuid"
)

type Domain struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4()"`
	FQDN      string    `json:"fqdn"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
