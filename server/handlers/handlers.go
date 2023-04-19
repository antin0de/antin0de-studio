package handlers

import (
	"github.com/robfig/cron/v3"
	"gorm.io/gorm"
)

type HandlerParams struct {
	Db                 *gorm.DB
	CronInstance       *cron.Cron
	TaskToCronEntryMap *map[string]cron.EntryID
}
