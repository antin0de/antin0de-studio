package main

import "os/exec"

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
