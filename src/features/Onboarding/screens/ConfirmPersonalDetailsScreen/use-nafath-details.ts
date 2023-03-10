import { useMutation } from "react-query";

import api from "@/api";

import { useOnboardingContext } from "../../context/OnboardingContext";
import NafathDetails from "./NafathDetails";

export default function useNafathDetails() {
  const { fetchLatestWorkflowTask, revertWorkflowTask, nationalId, correlationId } = useOnboardingContext();

  return useMutation(async () => {
    if (undefined === correlationId) throw new Error("Cannot fetch customers/data without `correlationId`");

    let workflowTask = await fetchLatestWorkflowTask();
    if (workflowTask && workflowTask?.Name === "ConfirmPersonalDetails") {
      await revertWorkflowTask(workflowTask);
    }

    workflowTask = await fetchLatestWorkflowTask();
    if (!workflowTask || workflowTask.Name !== "RetrievePersonalDetails") {
      throw new Error("Available workflowTaskId is not applicable to customers/data");
    }

    return api<NafathDetails>(
      "v1",
      "customers/data",
      "POST",
      undefined,
      {
        NationalId: nationalId,
      },
      {
        ["X-Workflow-Task-Id"]: workflowTask.Id,
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}
