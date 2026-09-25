import { expect, HttpStatus, tasksClient, test, TodoApiData } from '@automation/api';
import { Tag } from '@automation/common';
import type { Task } from '@automation/api';

test.describe('UpdateTaskTests', { tag: [Tag.Regression, Tag.Api] }, () => {
  test('UpdateTask_ValidText_ReturnsOkWithUpdatedTask', async () => {
    // Arrange
    const createdTask = await tasksClient.createTask(TodoApiData.newTaskText);

    // Act
    const response = await tasksClient.updateText(createdTask.id, { text: TodoApiData.updatedTaskText });

    // Assert
    expect(response.status()).toBe(HttpStatus.Ok);
    expect(await response.json()).toEqual({ ...createdTask, text: TodoApiData.updatedTaskText });
  });

  test('UpdateTask_ValidText_ChangeIsPersisted', async () => {
    // Arrange
    const createdTask = await tasksClient.createTask(TodoApiData.newTaskText);

    // Act
    await tasksClient.updateText(createdTask.id, { text: TodoApiData.updatedTaskText });

    // Assert
    const tasks = (await (await tasksClient.getAll()).json()) as Task[];
    expect(tasks).toContainEqual({ ...createdTask, text: TodoApiData.updatedTaskText });
  });

  test('UpdateTask_UnknownId_ReturnsNotFound', async () => {
    // Act
    const response = await tasksClient.updateText(TodoApiData.nonExistingTaskId, {
      text: TodoApiData.updatedTaskText,
    });

    // Assert
    expect(response.status()).toBe(HttpStatus.NotFound);
  });
});
