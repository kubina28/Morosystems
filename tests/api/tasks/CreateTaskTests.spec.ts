import { expect, HttpStatus, tasksClient, test, TodoApiData } from '@automation/api';
import { Tag } from '@automation/common';
import type { Task } from '@automation/api';

test.describe('CreateTaskTests', { tag: [Tag.Regression, Tag.Api] }, () => {
  test('CreateTask_ValidText_ReturnsOkWithCreatedTask', async () => {
    // Arrange
    const requestTime = Date.now();

    // Act
    const response = await tasksClient.create({ text: TodoApiData.newTaskText });

    // Assert
    expect(response.status()).toBe(HttpStatus.Ok);
    const task = (await response.json()) as Task;
    expect(task).toEqual({
      id: expect.any(String),
      text: TodoApiData.newTaskText,
      completed: false,
      createdDate: expect.any(Number),
    });
    expect(task.createdDate).toBeGreaterThanOrEqual(requestTime);
  });

  test('CreateTask_ValidText_TaskIsListed', async () => {
    // Arrange
    const createdTask = await tasksClient.createTask(TodoApiData.newTaskText);

    // Act
    const tasks = (await (await tasksClient.getAll()).json()) as Task[];

    // Assert
    expect(tasks).toContainEqual(createdTask);
  });

  test('CreateTask_MissingText_ReturnsUnprocessableEntity', async () => {
    // Act
    const response = await tasksClient.create({});

    // Assert
    expect(response.status()).toBe(HttpStatus.UnprocessableEntity);
    expect(await response.text()).toContain("'text' field must be present");
  });
});
