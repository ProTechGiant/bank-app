import i18next from "i18next";
import { useMutation } from "react-query";

import sendApiRequest from "@/api";
import { getUniqueDeviceId, nationalIdRegEx } from "@/utils";

import { IQAMA_TYPE, NATIONAL_ID_TYPE, OnboardingUserAccountStatusEnum } from "../constants";

interface ApiOnboardingTasksResponse {
  Tasks: Array<{ Id: string; Name: string }>;
}
interface ApiOnboardingUserAccountResponse {
  OnboardingStatus: OnboardingUserAccountStatusEnum;
}

export function useOnboardingInstance() {
  return useMutation(
    async ({
      correlationId,
      NationalId,
      MobileNumber,
    }: {
      correlationId: string;
      NationalId: string;
      MobileNumber: string;
    }) => {
      const deviceId = await getUniqueDeviceId();
      return sendApiRequest<{ OnboardingProcessId: string; UserId: string }>(
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
          ["Accept-Language"]: i18next.language.toUpperCase(),
          ["deviceId"]: deviceId,
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

export function useOnboardedUserAccountStatus() {
  return useMutation(({ correlationId, workflowTaskId }: { correlationId: string; workflowTaskId: string }) => {
    return sendApiRequest<ApiOnboardingUserAccountResponse>("v1", "customers/status", "GET", undefined, undefined, {
      ["x-Correlation-Id"]: correlationId,
      ["X-Workflow-Task-Id"]: workflowTaskId,
    });
  });
}
