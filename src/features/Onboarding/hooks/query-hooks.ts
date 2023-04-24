import { useMutation, useQuery } from "react-query";

import sendApiRequest from "@/api";

import { useOnboardingContext } from "../contexts/OnboardingContext";
import { FatcaFormInput, FinancialDetails, IqamaInputs, NafathDetails, Status } from "../types";

interface ApiOnboardingStatusResponse {
  OnboardingStatus: Status;
  workflowTask: { Id: string; Name: string };
}

interface OtpResponseType {
  LinkId: string;
  Otp: number;
}

interface IqamaResponse {
  CustomerId: string;
  CustomerType: string;
  NationalId: string;
  MobileNumber: string;
}

type WorkflowStep = {
  Id: string;
  Name: string;
};

function assertWorkflowTask(
  step: string,
  expects: string,
  value: WorkflowStep | undefined
): asserts value is WorkflowStep {
  if (undefined !== value && value.Name === expects) return;

  const message = `Available workflowTaskId not applicable to ${step}. Expected "${expects}", received "${value?.Name}"`;
  throw new Error(message);
}

export function useConfirmPersonalDetails() {
  const { fetchLatestWorkflowTask, correlationId } = useOnboardingContext();

  return useMutation(async () => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    const workflowTask = await fetchLatestWorkflowTask();
    if (!workflowTask || workflowTask.Name !== "ConfirmPersonalDetails")
      throw new Error("Available workflowTaskId is not applicable to customers/confirm/data");

    return sendApiRequest<string>(
      "v1",
      "customers/confirm/data",
      "POST",
      undefined,
      {
        CustomerConfirmationFlag: true,
      },
      {
        ["X-Workflow-Task-Id"]: workflowTask?.Id,
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}

export function useNafathDetails() {
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

    return sendApiRequest<NafathDetails>(
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

export function useFatcaDetails() {
  const { fetchLatestWorkflowTask, correlationId } = useOnboardingContext();

  return useMutation(async (values: FatcaFormInput) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    const workflowTask = await fetchLatestWorkflowTask();

    if (!workflowTask || workflowTask.Name !== "Fatca&Crs")
      throw new Error("Available workflowTaskId is not applicable to customers/tax/residency/details");

    return sendApiRequest<string>("v1", "customers/tax/residency/details", "POST", undefined, values, {
      ["X-Workflow-Task-Id"]: workflowTask?.Id,
      ["x-correlation-id"]: correlationId,
    });
  });
}

export function useSubmitFinancialDetails() {
  const { fetchLatestWorkflowTask, correlationId } = useOnboardingContext();

  return useMutation(async (values: FinancialDetails) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    const workflowTask = await fetchLatestWorkflowTask();
    if (!workflowTask || workflowTask.Name !== "PersistFinancialInfo")
      throw new Error("Available workflowTaskId is not applicable to customers/financial/details");

    return sendApiRequest<string>(
      "v1",
      "customers/financial/details",
      "POST",
      undefined,
      { ...values },
      {
        ["X-Workflow-Task-Id"]: workflowTask.Id,
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}

export function useIqama() {
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

    return sendApiRequest<IqamaResponse>(
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

      return sendApiRequest<IqamaResponse>(
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

export function useRequestNumber() {
  const { nationalId, correlationId } = useOnboardingContext();

  return useMutation(async () => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    return sendApiRequest<OtpResponseType>(
      "v1",
      "customers/link",
      "POST",
      undefined,
      {
        NationalId: nationalId,
      },
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}

export function useEmail() {
  const { fetchLatestWorkflowTask, correlationId } = useOnboardingContext();

  return useMutation(async (email: string | undefined) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    const workflowTask = await fetchLatestWorkflowTask();
    if (!workflowTask || workflowTask.Name !== "PersistEmail")
      throw new Error("Available workflowTaskId is not applicable to customers/email");

    return sendApiRequest<string>(
      "v1",
      "customers/email",
      "PUT",
      undefined,
      {
        Email: !!email && email.length > 0 ? email : null,
      },
      {
        ["X-Workflow-Task-Id"]: workflowTask?.Id,
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}

export function useAccountStatus(fetchPosts: boolean) {
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

      const status = await sendApiRequest<ApiOnboardingStatusResponse>(
        "v1",
        "customers/status",
        "GET",
        undefined,
        undefined,
        {
          ["X-Workflow-Task-Id"]: workflowTask.Id,
          ["x-correlation-id"]: correlationId,
        }
      );

      return {
        ...status,
        workflowTask,
      };
    },
    { refetchInterval: 2000, enabled: fetchPosts }
  );
}

//TODO: Update this function when BE is finished
export function useTermsConditions() {
  const { fetchLatestWorkflowTask, correlationId } = useOnboardingContext();

  return useMutation(async () => {
    if (undefined === correlationId) throw new Error("Cannot fetch customers/terms-conditions without `correlationId`");

    const workflowTask = await fetchLatestWorkflowTask();
    if (!workflowTask || workflowTask.Name !== "T&C")
      throw new Error("Available workflowTaskId is not applicable to customers/terms-conditions");

    return sendApiRequest<string>(
      "v1",
      "customers/terms-conditions",
      "POST",
      undefined,
      {
        TermsAndConditionsFlag: true,
        TermsAndConditionsVersionNumber: "1.0",
        DeclarationsFlag: true,
        DeclarationsVersionNumber: "1.0",
      },
      {
        ["X-Workflow-Task-Id"]: workflowTask.Id,
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}
