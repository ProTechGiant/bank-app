import { useMutation } from "react-query";

import sendApiRequest from "@/api";
import { nationalIdRegEx } from "@/utils";

import { IQAMA_TYPE, NATIONAL_ID_TYPE } from "../constants";
import { Status } from "../types";

interface ApiOnboardingTasksResponse {
  Tasks: Array<{ Id: string; Name: string }>;
}

export function useOnboardingInstance() {
  return useMutation(
    ({
      correlationId,
      NationalId,
      MobileNumber,
    }: {
      correlationId: string;
      NationalId: string;
      MobileNumber: string;
    }) => {
      return sendApiRequest<{ Status: Status; TempUserId: string }>(
        "v1",
        "customers/state",
        "POST",
        undefined,
        {
          NationalId: NationalId,
          MobileNumber: MobileNumber,
          NationalIdType: NationalId.match(nationalIdRegEx) ? NATIONAL_ID_TYPE : IQAMA_TYPE,
        },
        {
          ["x-Correlation-Id"]: correlationId,
        }
      );
    }
  );
}

export function useOnboardingRevertTask() {
  return useMutation(
    ({ correlationId, WorkflowTask }: { correlationId: string; WorkflowTask: { Id: string; Name: string } }) => {
      return sendApiRequest<void>("v1", "customers/revert/task", "PUT", undefined, undefined, {
        ["x-Correlation-Id"]: correlationId,
        ["X-Workflow-Task-Id"]: WorkflowTask.Id,
      });
    }
  );
}

export function useOnboardingTasks() {
  return useMutation(({ correlationId }: { correlationId: string }) => {
    return sendApiRequest<ApiOnboardingTasksResponse>("v1", "tasks", "GET", undefined, undefined, {
      ["x-Correlation-Id"]: correlationId,
    });
  });
}
