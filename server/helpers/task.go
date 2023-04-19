package helpers

import (
	"fmt"
	"regexp"

	"antin0.de/studio/models"
	"github.com/robfig/cron/v3"
	"gorm.io/gorm"
)

func IsValidTaskType(taskType string) bool {
	return taskType == "DOMAIN_SCAN"
}

func IsValidCronExpression(cronExpression string) bool {
	r, _ := regexp.Compile(`(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(/|-)\d+)|\d+|\*) ?){5,7})`)
	return r.MatchString(cronExpression)
}

func ScheduleTask(task models.Task, c *cron.Cron, entryMap *map[string]cron.EntryID, db *gorm.DB) bool {
	println("Scheduling task:", task.Name, task.ID.String(), task.CronSchedule)
	entryId, exists := (*entryMap)[task.ID.String()]
	if exists {
		println("Task already scheduled, removing old entry")
		c.Remove(entryId)
		delete(*entryMap, task.ID.String())
	}
	entryId, _ = c.AddFunc(task.CronSchedule, func() {
		var taskRun = models.TaskRun{
			TaskID: task.ID,
			Status: "PENDING",
			Log:    "",
		}
		db.Create(&taskRun)
		fmt.Println("Creating task run", task.Name, task.ID.String(), task.CronSchedule, "runID=", taskRun.ID.String())
	})
	(*entryMap)[task.ID.String()] = entryId
	return true
}

func UnscheduleTask(task models.Task, c *cron.Cron, entryMap *map[string]cron.EntryID) bool {
	println("Unscheduling task:", task.Name, task.ID.String(), task.CronSchedule)
	entryId, exists := (*entryMap)[task.ID.String()]
	if !exists {
		return false
	}
	c.Remove(entryId)
	delete(*entryMap, task.ID.String())
	return true
}
