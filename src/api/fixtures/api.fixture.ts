import { test as base } from '@playwright/test';
import { TasksClient } from '../clients/tasks.client';
import { environment } from '@automation/common';

export let tasksClient: TasksClient;

type AutoFixtures = {
  apiClients: void;
};

export const test = base.extend<AutoFixtures>({
  apiClients: [
    async ({ request }, use) => {
      await request.get('/').catch(() => {
        throw new Error(
          `Todo API is not reachable at ${environment.todoApiBaseUrl}. Run "npm run api:setup" and "npm run api:start".`,
        );
      });
      tasksClient = new TasksClient(request);
      await use();
      await tasksClient.deleteCreatedTasks();
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
