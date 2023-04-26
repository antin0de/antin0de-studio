package main

import (
	"log"
	"os"
	"time"

	"antin0.de/studio-runner/api_client"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	apiEndpoint := os.Getenv("ANTIN0DE_STUDIO_API_ENDPOINT")
	apiPassword := os.Getenv("ANTIN0DE_STUDIO_API_PASSWORD")
	toolsDir := os.Getenv("ANTIN0DE_STUDIO_TOOLS_DIR")

	for {
		api := api_client.ApiClientParams{ApiEndpoint: apiEndpoint, ApiPassword: apiPassword}
		resp := api.DequeueTaskRun()
		if resp.TaskRun.ID == "" {
			println("No more tasks to run, sleeping for 5 seconds...")
			time.Sleep(5 * time.Second)
		} else {
			println("Running Task: " + resp.TaskRun.ID)
			startTime := time.Now()
			output, err := RunCommandAndGetOutput(toolsDir, "./bbot-scan.sh", "-h", apiEndpoint, "-t", resp.TaskRun.Task.TaskConfig, "-n", "owasp-scan", "-p", "localpass")
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
