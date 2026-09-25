import { expect, HttpStatus, tasksClient, test, TodoApiData } from '@automation/api';
import { Tag } from '@automation/common';
import type { Task } from '@automation/api';

test.describe('GetTasksTests', { tag: [Tag.Regression, Tag.Api] }, () => {
  test('GetTasks_RequestAll_ReturnsOkWithTaskList', async () => {
    // Arrange
    const createdTask = await tasksClient.createTask(TodoApiData.newTaskText);

    // Act
    const response = await tasksClient.getAll();

    // Assert
    expect(response.status()).toBe(HttpStatus.Ok);
    const tasks = (await response.json()) as Task[];
    expect(tasks).toContainEqual(createdTask);
    for (const task of tasks) {
      expect(task).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          completed: expect.any(Boolean),
          createdDate: expect.any(Number),
        }),
      );
    }
  });
});
