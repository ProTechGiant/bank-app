import { useQuery } from "react-query";

import api from "@/api";

import { useOnboardingContext } from "../../context/OnboardingContext";

export type Status = "COMPLETED" | "PENDING" | "DECLINED";

interface ApiOnboardingStatusResponse {
  OnboardingStatus: Status;
  workflowTask: { Id: string; Name: string };
}

export default function useAccountStatus(fetchPosts: boolean) {
  const { fetchLatestWorkflowTask, correlationId } = useOnboardingContext();

  return useQuery(
    "AccountStatus",
    async () => {
      if (undefined === correlationId) throw new Error("Cannot fetch customers/status without `correlationId`");

      const workflowTask = await fetchLatestWorkflowTask();

      if (workflowTask?.Name !== "RetrieveValidationStatus") {
        return {
          OnboardingStatus: "PENDING",
          workflowTask,
        };
      }

      const status = await api<ApiOnboardingStatusResponse>("v1", "customers/status", "GET", undefined, undefined, {
        ["X-Workflow-Task-Id"]: workflowTask.Id,
        ["x-correlation-id"]: correlationId,
      });

      return {
        ...status,
        workflowTask,
      };
    },
    { refetchInterval: 2000, enabled: fetchPosts }
  );
}
