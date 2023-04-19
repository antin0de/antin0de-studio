import { ApiService } from "../api/ApiService";

export interface Task {
  id: string;
  name: string;
  taskType: string;
  taskConfig: string;
  cronSchedule: string;
}

export class TaskService {
  static async listTasks(): Promise<Task[]> {
    const response = await ApiService.get<{ tasks: Task[] }>("/v1/tasks");
    return response.tasks;
  }
}
