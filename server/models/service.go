package models

import (
	"time"

	"github.com/google/uuid"
)

type Service struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4()"`
	Name      string    `json:"name"`
	Port      uint64    `json:"port"`
	Protocol  string    `json:"protocol"`
	DomainID  uuid.UUID `json:"domainId"`
	Domain    Domain    `json:"domain"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
