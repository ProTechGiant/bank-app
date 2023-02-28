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
  const { fetchLatestWorkflowTask, correlationId, setNationalId } = useOnboardingContext();

  return useMutation(
    async (values: IqamaInputs) => {
      if (!correlationId) throw new Error("Need valid `correlationId` to be available");

      const workflowTask = await fetchLatestWorkflowTask();
      assertWorkflowTask("customers/check", "MobileVerification", workflowTask);

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
