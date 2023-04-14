package handlers

import "gorm.io/gorm"

type HandlerParams struct {
	Db *gorm.DB
}
