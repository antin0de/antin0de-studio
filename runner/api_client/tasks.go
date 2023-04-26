package api_client

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

type TaskRun struct {
	ID   string `json:"id"`
	Task Task   `json:"task"`
}

type Task struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	TaskType   string `json:"taskType"`
	TaskConfig string `json:"taskConfig"`
}

type DequeueTaskRunResponse struct {
	TaskRun TaskRun `json:"taskRun"`
}

func (a *ApiClientParams) DequeueTaskRun() DequeueTaskRunResponse {
	values := map[string]interface{}{"setAsRunning": true}
	jsonData, err := json.Marshal(values)
	if err != nil {
		panic(err)
	}

	req, err := http.NewRequest(http.MethodPost, a.ApiEndpoint+"/v1/task_runs/dequeue", bytes.NewBuffer(jsonData))
	if err != nil {
		panic(err)
	}

	q := req.URL.Query()
	q.Add("password", a.ApiPassword)
	req.URL.RawQuery = q.Encode()

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	var dequeueResponse DequeueTaskRunResponse
	json.Unmarshal(body, &dequeueResponse)

	return dequeueResponse
}

type UpdateTaskRunRequest struct {
	Status      string `json:"status"`
	RunDuration int64  `json:"runDuration"`
	Log         string `json:"log"`
}

func (a *ApiClientParams) UpdateTaskRun(taskRunId string, request UpdateTaskRunRequest) bool {
	jsonData, err := json.Marshal(request)
	if err != nil {
		panic(err)
	}

	req, err := http.NewRequest(http.MethodPut, a.ApiEndpoint+"/v1/task_runs/"+taskRunId, bytes.NewBuffer(jsonData))
	if err != nil {
		panic(err)
	}

	q := req.URL.Query()
	q.Add("password", a.ApiPassword)
	req.URL.RawQuery = q.Encode()

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	_, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	return true
}
