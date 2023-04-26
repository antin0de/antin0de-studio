import { ApiService } from "../api/ApiService";

export interface Task {
  id: string;
  name: string;
  taskType: string;
  taskConfig: string;
  cronSchedule: string;
  taskRuns?: TaskRun[];
}

export interface TaskRun {
  id: string;
  status: string;
  runDuration: number;
  log: string;
  createdAt: string;
}

export class TaskService {
  static async createTask(task: {
    name: string;
    taskType: string;
    taskConfig: string;
    cronSchedule: string;
  }): Promise<void> {
    await ApiService.post("/v1/tasks", task);
  }

  static async listTasks(): Promise<Task[]> {
    const response = await ApiService.get<{ tasks: Task[] }>("/v1/tasks");
    return response.tasks;
  }

  static async getTask(id: string): Promise<Task> {
    const response = await ApiService.get<{ task: Task }>(`/v1/tasks/${id}`);
    return response.task;
  }
}
