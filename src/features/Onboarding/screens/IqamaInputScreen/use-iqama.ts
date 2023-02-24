import { useMutation } from "react-query";

import api from "@/api";

import { useOnboardingContext } from "../../context/OnboardingContext";
import IqamaInputs from "./IqamaInputs";

interface IqamaResponse {
  CustomerId: string;
  CustomerType: string;
  NationalId: string;
  MobileNumber: string;
}

export default function useIqama() {
  const { fetchLatestWorkflowTask, correlationId, setNationalId } = useOnboardingContext();

  return useMutation(
    async (values: IqamaInputs) => {
      if (!correlationId) throw new Error("Need valid `correlationId` to be available");

      const workflowTask = await fetchLatestWorkflowTask();
      if (!workflowTask || workflowTask.Name !== "MobileVerification")
        throw new Error("Available workflowTaskId is not applicable to customers/check");

      return api<IqamaResponse>(
        "v1",
        "customers/checks",
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
    },
    {
      onSuccess(data, _variables, _context) {
        setNationalId(String(data.NationalId));
      },
    }
  );
}
