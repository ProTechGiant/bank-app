type WorkflowStep = {
  Id: string;
  Name: string;
};

// eslint-disable-next-line prettier/prettier
export default function assertWorkflowTask(step: string, expects: string, value: WorkflowStep | undefined): asserts value is WorkflowStep {
  if (undefined !== value && value.Name === expects) return;

  const message = `Available workflowTaskId not applicable to ${step}. Expected "${expects}", received "${value?.Name}"`;
  throw new Error(message);
}
