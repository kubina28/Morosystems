# BUG-002: Todo API – statuses for an unknown task ID do not match the documentation

|                     |                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| **API**             | `morosystems/todo-be` (`http://localhost:8080`)                                                      |
| **Endpoints**       | `DELETE /tasks/{id}`, `POST /tasks/{id}`, `POST /tasks/{id}/complete`, `POST /tasks/{id}/incomplete` |
| **Severity**        | Low – the API and its documentation disagree, clients relying on the documentation break             |
| **Reproducibility** | always                                                                                               |
| **Found**           | 2026-09-25                                                                                           |
| **Covered by**      | `tests/api/tasks/DeleteTaskTests.spec.ts` – `DeleteTask_UnknownId_ReturnsBadRequest`                 |

## Steps to reproduce

1. Start the backend (`npm run api:setup`, `npm run api:start`).
2. Send `DELETE http://localhost:8080/tasks/non-existing-task-id`.

## Expected result

According to the API documentation (`/api-docs`) the response is **400** – _„ID of task was not found“_.

## Actual result

The response is **404** with the body _„id not found, nothing to delete“_. The same applies to
`POST /tasks/{id}/complete` and `POST /tasks/{id}/incomplete`.

The update endpoint `POST /tasks/{id}` also answers 404 for an unknown ID, but its documentation does not list
this case at all (only 200 and 422).

## Evidence

| Request                                     | Documented                     | Actual                                  |
| ------------------------------------------- | ------------------------------ | --------------------------------------- |
| `DELETE /tasks/non-existing-task-id`        | 400                            | 404 `id not found, nothing to delete`   |
| `POST /tasks/non-existing-task-id/complete` | 400                            | 404 `id not found, nothing to complete` |
| `POST /tasks/non-existing-task-id` (update) | not documented (200, 422 only) | 404 `id not found, nothing to update`   |

Source: `src/routes.ts` documents `@return {string} 400 - ID of task was not found`, while `src/controller.ts`
sends `res.status(404)`.

## Suggested fix

Align the documentation and the implementation. 404 is the conventional status for a missing resource, so updating
the documentation to 404 for all four endpoints is probably the right fix.
