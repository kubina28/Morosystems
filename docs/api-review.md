# Todo API – specification review

Review of the `morosystems/todo-be` API done **before** writing the API tests (shift-left): the assignment,
the API documentation (`/api-docs`, `/v3/api-docs`) and the implementation (`src/routes.ts`, `src/controller.ts`)
were compared, and every finding was verified by a real request.

The API tests treat the **documentation as the specification**. Where the implementation differs, the test fails
and the difference is reported as a bug instead of adapting the test to the current behaviour.

## Findings

| #   | Finding                                                                                                              | Source of the conflict                    | Classification                                                                                 |
| --- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1   | Unknown task ID returns **404**, the documentation specifies **400** (`DELETE`, `complete`, `incomplete`)            | documentation vs. implementation          | [BUG-002](bug-reports/BUG-002-todo-api-unknown-task-id-statuses-do-not-match-documentation.md) |
| 2   | Update with an unknown task ID returns 404, the documentation does not list this case                                | incomplete documentation                  | [BUG-002](bug-reports/BUG-002-todo-api-unknown-task-id-statuses-do-not-match-documentation.md) |
| 3   | `text` is a `string` in the schema, but a number (`{ "text": 123 }`) is accepted on create and update                | schema vs. implementation                 | [BUG-003](bug-reports/BUG-003-todo-api-accepts-non-string-task-text.md)                        |
| 4   | Whitespace-only text (`{ "text": "   " }`) is accepted                                                               | unclear requirement                       | question for the product owner                                                                 |
| 5   | The assignment asks for `PUT`, the API updates a task by `POST /tasks/{id}` (`PUT` returns 404)                      | assignment vs. API                        | observation – the API matches its documentation                                                |
| 6   | `GET /tasks` sorts with a one-argument comparator (`sort((item) => item.createdDate)`), so the tasks are not ordered | logic error                               | observation – the documentation does not promise any order                                     |
| 7   | Create returns **200** instead of **201 Created**, delete returns 200 with an empty body instead of **204**          | REST conventions                          | recommendation                                                                                 |
| 8   | `GET /tasks` takes about 3 seconds                                                                                   | documented as intended (_„Slow service“_) | observation                                                                                    |

## Impact on test automation

- **Tests follow the documentation.** `DeleteTask_UnknownId_ReturnsBadRequest` and
  `CreateTask_NumericText_ReturnsUnprocessableEntity` fail until BUG-002 and BUG-003 are resolved.
- **No client generated from the OpenAPI specification.** The specification does not match the implementation;
  a generated client would carry these errors into the tests. Generating types from the specification makes sense
  once the findings above are resolved.
- **Update is tested through `POST /tasks/{id}`**, the documented endpoint, and the missing `PUT` is reported
  as an observation.

## Questions for the product owner

- Should whitespace-only task text be rejected like an empty text? (finding 4)
- Is a defined order of `GET /tasks` required, e.g. by creation date? (finding 6)
