import { expect, HttpStatus, tasksClient, test, TodoApiData } from '@automation/api';
import { Tag } from '@automation/common';
import type { Task } from '@automation/api';

test.describe('DeleteTaskTests', { tag: [Tag.Regression, Tag.Api] }, () => {
  test('DeleteTask_ExistingTask_ReturnsOk', async () => {
    // Arrange
    const createdTask = await tasksClient.createTask(TodoApiData.newTaskText);

    // Act
    const response = await tasksClient.delete(createdTask.id);

    // Assert
    expect(response.status()).toBe(HttpStatus.Ok);
  });

  test('DeleteTask_ExistingTask_TaskIsNotListed', async () => {
    // Arrange
    const createdTask = await tasksClient.createTask(TodoApiData.newTaskText);

    // Act
    await tasksClient.delete(createdTask.id);

    // Assert
    const tasks = (await (await tasksClient.getAll()).json()) as Task[];
    expect(tasks.map((task) => task.id)).not.toContain(createdTask.id);
  });

  // The API documentation (Swagger) specifies 400 for a task ID that was not found.
  test('DeleteTask_UnknownId_ReturnsBadRequest', async () => {
    // Act
    const response = await tasksClient.delete(TodoApiData.nonExistingTaskId);

    // Assert
    expect(response.status()).toBe(HttpStatus.BadRequest);
  });
});
