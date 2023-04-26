package commands

import (
	"os/exec"

	"antin0.de/studio-runner/api_client"
	"antin0.de/studio-runner/config"
	"gopkg.in/yaml.v2"
)

func RunCommandAndGetOutput(dir string, command string, args ...string) (string, error) {
	cmd := exec.Command(command, args...)
	cmd.Dir = dir
	out, err := cmd.CombinedOutput()

	if err != nil {
		return "", err
	}

	output := string(out[:])
	return output, nil
}

type BbotScanConfig struct {
	Domain string `yaml:"domain"`
}

func RunBbotScanAndGetOutput(taskRun api_client.TaskRun) (string, error) {
	config := config.GetConfig()
	taskConfig := BbotScanConfig{}
	err := yaml.Unmarshal([]byte(taskRun.Task.TaskConfig), &taskConfig)
	if err != nil {
		return "", err
	}
	output, err := RunCommandAndGetOutput(
		config.ToolsDir,
		"./bbot-scan.sh",
		"-t", taskConfig.Domain,
		"-n", "owasp-scan",
		"-h", config.ApiEndpoint,
		"-p", config.ApiPassword)
	return output, err
}
