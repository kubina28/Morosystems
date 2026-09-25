export const TodoApiRoutes = Object.freeze({
  tasks: '/tasks',
  task: (taskId: string) => `/tasks/${taskId}`,
});
