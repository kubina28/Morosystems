import type { APIRequestContext, APIResponse } from '@playwright/test';
import { TodoApiRoutes } from '../constants/routes';
import type { Task } from '../models/task.model';

export class TasksClient {
  private readonly createdTaskIds: string[] = [];

  constructor(private readonly request: APIRequestContext) {}

  async getAll(): Promise<APIResponse> {
    return this.request.get(TodoApiRoutes.tasks);
  }

  async create(payload: object): Promise<APIResponse> {
    const response = await this.request.post(TodoApiRoutes.tasks, { data: payload });
    if (response.ok()) {
      this.createdTaskIds.push(((await response.json()) as Task).id);
    }
    return response;
  }

  async createTask(text: string): Promise<Task> {
    return (await (await this.create({ text })).json()) as Task;
  }

  // The API has no PUT endpoint, the task text is updated by POST /tasks/{id}.
  async updateText(taskId: string, payload: object): Promise<APIResponse> {
    return this.request.post(TodoApiRoutes.task(taskId), { data: payload });
  }

  async delete(taskId: string): Promise<APIResponse> {
    return this.request.delete(TodoApiRoutes.task(taskId));
  }

  async deleteCreatedTasks(): Promise<void> {
    for (const taskId of this.createdTaskIds.splice(0)) {
      await this.delete(taskId);
    }
  }
}
