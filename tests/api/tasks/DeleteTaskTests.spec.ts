import { expect, HttpStatus, tasksClient, test, TodoApiData, TodoApiKnownIssues } from '@automation/api';
import { Tag } from '@automation/common';

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
    const tasks = await tasksClient.getAllTasks();
    expect(tasks.map((task) => task.id)).not.toContain(createdTask.id);
  });

  test.fail(
    'DeleteTask_UnknownId_ReturnsBadRequest',
    { annotation: TodoApiKnownIssues.unknownTaskIdStatus },
    async () => {
      // Act
      const response = await tasksClient.delete(TodoApiData.nonExistingTaskId);

      // Assert
      expect(response.status()).toBe(HttpStatus.BadRequest);
    },
  );
});
