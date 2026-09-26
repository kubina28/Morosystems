const BUG_REPORTS_URL = 'https://github.com/kubina28/Morosystems/blob/main/docs/bug-reports';

export const TodoApiKnownIssues = Object.freeze({
  unknownTaskIdStatus: {
    type: 'issue',
    description: `${BUG_REPORTS_URL}/BUG-002-todo-api-unknown-task-id-statuses-do-not-match-documentation.md`,
  },
  nonStringTaskTextAccepted: {
    type: 'issue',
    description: `${BUG_REPORTS_URL}/BUG-003-todo-api-accepts-non-string-task-text.md`,
  },
});
