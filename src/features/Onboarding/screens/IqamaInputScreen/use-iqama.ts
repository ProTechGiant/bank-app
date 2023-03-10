import { useMutation } from "react-query";

import api from "@/api";

import assertWorkflowTask from "../../assert-workflow-task";
import { useOnboardingContext } from "../../context/OnboardingContext";
import IqamaInputs from "./IqamaInputs";

interface IqamaResponse {
  CustomerId: string;
  CustomerType: string;
  NationalId: string;
  MobileNumber: string;
}

export default function useIqama() {
  const { startOnboardingAsync, fetchLatestWorkflowTask, correlationId, setNationalId, currentTask } =
    useOnboardingContext();

  const handleSignUp = async (values: IqamaInputs) => {
    if (!correlationId) {
      throw new Error("Need valid `correlationId` to be available");
    }
    if (currentTask?.Name !== "MobileVerification") {
      await startOnboardingAsync(values.NationalId, values.MobileNumber);
    }

    const workflowTask = await fetchLatestWorkflowTask();
    assertWorkflowTask("customers/validate/mobile", "MobileVerification", workflowTask);

    return api<IqamaResponse>(
      "v1",
      "customers/validate/mobile",
      "POST",
      undefined,
      {
        NationalId: values.NationalId,
        MobileNumber: values.MobileNumber,
      },
      {
        ["X-Workflow-Task-Id"]: workflowTask.Id,
        ["x-correlation-id"]: correlationId,
      }
    );
  };

  const handleRetrySignUp = async (values: IqamaInputs) => {
    if (!correlationId) {
      throw new Error("Need valid `correlationId` to be available");
    }
    const workflowTask = await fetchLatestWorkflowTask();

    if (workflowTask && workflowTask?.Name === "MobileVerification") {
      assertWorkflowTask("customers/validate/mobile", "MobileVerification", workflowTask);

      return api<IqamaResponse>(
        "v1",
        "customers/validate/mobile",
        "POST",
        undefined,
        {
          NationalId: values.NationalId,
          MobileNumber: values.MobileNumber,
        },
        {
          ["X-Workflow-Task-Id"]: workflowTask.Id,
          ["x-correlation-id"]: correlationId,
        }
      );
    }
  };

  return useMutation(handleSignUp, {
    onSuccess(data, _variables, _context) {
      setNationalId(String(data.NationalId));
    },
    onError(error, variables, _context) {
      if (
        error &&
        error.errorContent &&
        error.errorContent.Errors &&
        error.errorContent.Errors.some(({ ErrorId }: { ErrorId: string }) => ErrorId === "0061")
      ) {
        handleRetrySignUp(variables);
      }
    },
  });
}
