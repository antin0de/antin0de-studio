package main

import (
	"log"
	"time"

	"antin0.de/studio-runner/api_client"
	"antin0.de/studio-runner/commands"
	"antin0.de/studio-runner/config"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	config := config.GetConfig()

	for {
		api := api_client.ApiClientParams{ApiEndpoint: config.ApiEndpoint, ApiPassword: config.ApiPassword}
		resp := api.DequeueTaskRun()
		if resp.TaskRun.ID == "" {
			println("No more tasks to run, sleeping for 5 seconds...")
			time.Sleep(5 * time.Second)
		} else {
			println("Running Task: " + resp.TaskRun.ID)
			startTime := time.Now()
			output, err := commands.RunBbotScanAndGetOutput(resp.TaskRun)
			endTime := time.Now()
			if err != nil {
				api.UpdateTaskRun(resp.TaskRun.ID, api_client.UpdateTaskRunRequest{
					Status:      "FAILED",
					RunDuration: endTime.Sub(startTime).Nanoseconds(),
					Log:         err.Error(),
				})
			} else {
				api.UpdateTaskRun(resp.TaskRun.ID, api_client.UpdateTaskRunRequest{
					Status:      "SUCCESS",
					RunDuration: endTime.Sub(startTime).Nanoseconds(),
					Log:         output,
				})
			}

		}
	}
}
