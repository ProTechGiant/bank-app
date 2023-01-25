import { useMutation } from "react-query";

import sendApiRequest from "@/api";

import { useOnboardingContext } from "../../context/OnboardingContext";
import ApiOnboardingError from "../../types/ApiOnboardingError";
import IqamaInputs from "./IqamaInputs";

interface IqamaResponse {
  CustomerId: string;
  CustomerType: string;
  NationalId: string;
  MobileNumber: string;
}

export default function useIqama() {
  const { fetchLatestWorkflowTask, userId, correlationId, setNationalId } = useOnboardingContext();

  return useMutation(
    async (values: IqamaInputs) => {
      if (!userId || !correlationId) throw new Error("Need valid `userId` and `correlationId` to be available");

      const workflowTask = await fetchLatestWorkflowTask();
      if (!workflowTask || workflowTask.name !== "MobileVerification")
        throw new Error("Available workflowTaskId is not applicable to customers/check");

      return sendApiRequest<IqamaResponse, ApiOnboardingError>(
        "api-dev",
        "v1",
        "customers/checks",
        "POST",
        undefined,
        {
          NationalId: values.NationalId,
          MobileNumber: values.MobileNumber,
        },
        {
          ["X-Workflow-Task-Id"]: workflowTask.id,
          ["UserId"]: userId,
          ["x-correlation-id"]: correlationId,
        }
      );
    },
    {
      onSuccess(data, _variables, _context) {
        setNationalId(String(data.NationalId));
      },
    }
  );
}
