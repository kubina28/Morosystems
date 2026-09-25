# BUG-003: Todo API – task text of a non-string type is accepted

|                     |                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| **API**             | `morosystems/todo-be` (`http://localhost:8080`)                                                 |
| **Endpoints**       | `POST /tasks`, `POST /tasks/{id}`                                                               |
| **Severity**        | Medium – invalid data is stored and returned to all clients                                     |
| **Reproducibility** | always                                                                                          |
| **Found**           | 2026-09-25                                                                                      |
| **Covered by**      | `tests/api/tasks/CreateTaskTests.spec.ts` – `CreateTask_NumericText_ReturnsUnprocessableEntity` |

## Steps to reproduce

1. Start the backend (`npm run api:setup`, `npm run api:start`).
2. Send `POST http://localhost:8080/tasks` with the body `{ "text": 123 }`.

## Expected result

According to the API documentation (`/v3/api-docs`) `text` is a `string`, so the request is rejected with
**422**, the same way as a missing or empty text.

## Actual result

The response is **200** and the task is stored with a numeric text:

```json
{ "id": "QgZx3HvtVD33zUF7uUj4X", "text": 123, "completed": false, "createdDate": 1790351524024 }
```

Every client reading `GET /tasks` then receives a task that does not match the documented `Task` schema.

## Evidence

- OpenAPI schema `CreateTask` / `Task`: `"text": { "type": "string" }`.
- `src/controller.ts` validates only the presence of the value (`if (!req.body.text)`), not its type.

## Suggested fix

Validate that `text` is a non-empty string in `create` and `updateText` and answer 422 otherwise.
