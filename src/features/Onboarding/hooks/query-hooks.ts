import i18next from "i18next";
import queryString from "query-string";
import { useTranslation } from "react-i18next";
import DeviceInfo from "react-native-device-info";
import { useMutation, useQuery } from "react-query";

import api from "@/api";
import ApiError from "@/api/ApiError";
import ResponseError from "@/api/ResponseError";
import { useAuthContext } from "@/contexts/AuthContext";
import { nationalIdRegEx } from "@/utils";

import { CustomerStatus, IQAMA_TYPE, NATIONAL_ID_TYPE } from "../constants";
import { useOnboardingContext } from "../contexts/OnboardingContext";
import {
  CheckHighRiskInterface,
  ConfirmPersonalDataInterface,
  CustomerBasicInfo,
  CustomerInfo,
  CustomerPendingAction,
  CustomersTermsAndConditions,
  DownloadHighRiskDocumentResponse,
  FatcaFormInput,
  FinancialDetails,
  IqamaInputs,
  NafathDetails,
  RegistrationResponse,
  RetrieveUploadDocumentsListInterface,
  SendOnboardingOtpResponse,
  Status,
  StatusId,
  UploadDocumentHighRiskRequestInterface,
  UploadDocumentHighRiskResponseInterface,
} from "../types";

interface ApiOnboardingStatusResponse {
  OnboardingStatus: Status;
  workflowTask: { Id: string; Name: string };
}

interface OtpResponseType {
  Header: { StatusCode: string; RequestID: string; StatusDescription: string };
  Body: { transId: string; random: string };
}

interface IqamaResponse {
  CustomerId: string;
  CustomerType: string;
  Id: string;
  TaskName: string;
  NationalId: string;
  MobileNumber: string;
  Mobile: string;
  ReferenceNumber: string;
  IsOwner: boolean;
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

export function usePreferredLanguage() {
  const { correlationId, nationalId } = useOnboardingContext();
  const { i18n } = useTranslation();

  return useMutation(async () => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");
    if (!nationalId) throw new Error("Need valid `nationalId` to be available");

    return api<string>(
      "v1",
      "customers/preferred-language",
      "POST",
      undefined,
      {
        NationalId: nationalId,
        NationalIdType: nationalId.match(nationalIdRegEx) ? NATIONAL_ID_TYPE : IQAMA_TYPE,
      },
      {
        ["x-correlation-id"]: correlationId,
        ["Accept-Language"]: i18n.language.toUpperCase(),
      }
    );
  });
}

export function useConfirmPersonalDetails() {
  const { i18n } = useTranslation();
  const { fetchLatestWorkflowTask, correlationId } = useOnboardingContext();

  return useMutation(async (body: ConfirmPersonalDataInterface) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    const workflowTask = await fetchLatestWorkflowTask();
    if (!workflowTask || workflowTask.Name !== "ConfirmPersonalDetails")
      throw new Error("Available workflowTaskId is not applicable to customers/confirm/data");

    return api<NafathDetails>("v1", "customers/confirm/data", "POST", undefined, body, {
      ["X-Workflow-Task-Id"]: workflowTask?.Id,
      ["x-correlation-id"]: correlationId,
      ["Accept-Language"]: i18n.language.toUpperCase(),
    });
  });
}

export function useNafathDetails() {
  const { i18n } = useTranslation();

  const {
    fetchLatestWorkflowTask,
    setNationalId,
    setCustomerName,
    revertWorkflowTask,
    nationalId,
    transactionId,
    correlationId,
    setAddressData,
  } = useOnboardingContext();
  return useMutation(
    async () => {
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
        { TransactionId: transactionId },
        {
          NationalId: nationalId,
        },
        {
          ["X-Workflow-Task-Id"]: workflowTask.Id,
          ["x-correlation-id"]: correlationId,
          ["Accept-Language"]: i18n.language.toUpperCase(),
          ["deviceId"]: DeviceInfo.getDeviceId(),
        }
      );
    },
    {
      onSuccess(data: NafathDetails) {
        const customerName = i18n.language === "en" ? data.EnglishFirstName : data.ArabicFirstName;
        setCustomerName(customerName ?? "");
        setNationalId(data.NationalId || "");
        if (data?.Addresses) {
          setAddressData(data?.Addresses[0]);
        }
      },
    }
  );
}

export function useFatcaDetails() {
  const { i18n } = useTranslation();
  const { fetchLatestWorkflowTask, correlationId } = useOnboardingContext();

  return useMutation(async (values: FatcaFormInput) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    const workflowTask = await fetchLatestWorkflowTask();

    if (!workflowTask || workflowTask.Name !== "Fatca&Crs")
      throw new Error("Available workflowTaskId is not applicable to customers/tax/residency/details");

    return api<string>("v1", "customers/tax/residency/details", "POST", undefined, values, {
      ["X-Workflow-Task-Id"]: workflowTask?.Id,
      ["x-correlation-id"]: correlationId,
      ["Accept-Language"]: i18n.language.toUpperCase(),
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

    return api<string>(
      "v1",
      "customers/financial/details",
      "POST",
      undefined,
      { ...values },
      {
        ["X-Workflow-Task-Id"]: workflowTask.Id,
        ["Accept-Language"]: i18next.language.toUpperCase(),
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}

export function useIqama() {
  const auth = useAuthContext();
  const {
    startOnboardingAsync,
    fetchLatestWorkflowTask,
    correlationId,
    setNationalId,
    setMobileNumber,
    currentTask,
    setFobMobileNumber,
    checkFobEligibility,
  } = useOnboardingContext();
  const { i18n } = useTranslation();
  const { mutateAsync: mutateValidateMobileNumber } = useValidateMobileNo();

  const handleSignUp = async (values: IqamaInputs) => {
    if (!correlationId) {
      throw new Error("Need valid `correlationId` to be available");
    }

    setNationalId(String(values.NationalId));
    setMobileNumber(String(values.MobileNumber));

    if (currentTask?.Name !== "MobileVerification") {
      const result = await startOnboardingAsync(values.NationalId, values.MobileNumber);
      if (result.Status === CustomerStatus.PENDING) {
        auth.setUserId(result.TempUserId);
        throw new ApiError<Error>("", 400, {
          Errors: [{ Message: "Server Error", ErrorId: "0061", ErrorCode: "UK.CUSTOMER.INTERNAL_SERVER_ERROR" }],
        });
      } else if (result.Status === CustomerStatus.COMPLETED) {
        throw new ApiError<Error>("", 400, {
          Errors: [{ Message: "Server Error", ErrorId: "0086", ErrorCode: "UK.CUSTOMER.INTERNAL_SERVER_ERROR" }],
        });
      } else if (result.Status === CustomerStatus.DECLINED) {
        throw new ApiError<Error>("", 400, {
          Errors: [{ Message: "Server Error", ErrorId: "0085", ErrorCode: "UK.CUSTOMER.INTERNAL_SERVER_ERROR" }],
        });
      } else {
        auth.setUserId(result.TempUserId);
      }
    }
    // TODO: The comment will be uncomment and the object will be removed once api will be developed
    const workflowTask = await fetchLatestWorkflowTask();
    assertWorkflowTask("customers/validate/mobile", "CheckCustomerEligibilityInFOB", workflowTask);

    if (workflowTask.Id) {
      const body = {
        NationalId: values.NationalId,
        MobileNumber: values.MobileNumber,
        IdType: values.NationalId.match(nationalIdRegEx) ? 1 : 2,
      };

      const fobData = await checkFobEligibility(body, workflowTask, i18n.language.toUpperCase());

      setFobMobileNumber(fobData.ArbMobileNumber);

      const workflow = await fetchLatestWorkflowTask();

      if (workflow?.Name === "MobileVerification") {
        await mutateValidateMobileNumber({ nationalId: values.NationalId, mobileNo: values.MobileNumber });
      }
      return workflow;
    }
  };

  const handleRetrySignUp = async (values: IqamaInputs) => {
    if (!correlationId) {
      throw new Error("Need valid `correlationId` to be available");
    }
    const workflowTask = await fetchLatestWorkflowTask();

    if (workflowTask && workflowTask?.Name === "MobileVerification") {
      assertWorkflowTask("customers/validate/mobile", "MobileVerification", workflowTask);

      return await mutateValidateMobileNumber({ nationalId: values.NationalId, mobileNo: values.MobileNumber });
    }
  };

  return useMutation(handleSignUp, {
    onError(error: ApiError<ResponseError>, variables, _context) {
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

export function useGetCustomerBasicInfo(customerId: string) {
  const { correlationId } = useOnboardingContext();
  const { i18n } = useTranslation();

  return useQuery(
    ["CustomerBasicInfo", customerId],
    () => {
      if (!correlationId) throw new Error("Need valid Correlation id");

      return api<CustomerBasicInfo>("v1", `customers/${customerId}/basic-account-info`, "GET", undefined, undefined, {
        ["x-correlation-id"]: correlationId,
        ["Accept-Language"]: i18n.language.toUpperCase(),
      });
    },
    { enabled: !!customerId }
  );
}

export function useGetCustomerId() {
  const { correlationId, setCustomerInfo } = useOnboardingContext();
  const { i18n } = useTranslation();

  return useQuery(
    ["CustomerId"],
    () => {
      if (!correlationId) throw new Error("Need valid Correlation id");

      return api<CustomerInfo>("v1", `customers/customer-id`, "GET", undefined, undefined, {
        ["x-correlation-id"]: correlationId,
        ["Accept-Language"]: i18n.language.toUpperCase(),
      });
    },
    {
      onSuccess(data) {
        setCustomerInfo(data);
      },
    }
  );
}

export function useRequestNumber() {
  const { setTransactionId, correlationId, nationalId } = useOnboardingContext();
  const { i18n } = useTranslation();

  return useMutation(
    async () => {
      if (!correlationId) throw new Error("Need valid `correlationId` to be available");

      return api<OtpResponseType>(
        "v1",
        "customers/get-transaction-id",
        "POST",
        undefined,
        {},
        {
          ["x-correlation-id"]: correlationId,
          ["Accept-Language"]: i18n.language.toUpperCase(),
          ["deviceId"]: DeviceInfo.getDeviceId(),
          ["IDNumber"]: nationalId || "",
        }
      );
    },
    {
      onSuccess(data) {
        const transValue = data.Body.transId;
        setTransactionId(transValue);
      },
    }
  );
}

export function useEmail() {
  const { fetchLatestWorkflowTask, correlationId } = useOnboardingContext();

  return useMutation(async (email: string | undefined) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    const workflowTask = await fetchLatestWorkflowTask();
    if (!workflowTask || workflowTask.Name !== "PersistEmail")
      throw new Error("Available workflowTaskId is not applicable to customers/email");

    return api<string>(
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

      if (workflowTask?.Name === "CreatePasscode") {
        return {
          OnboardingStatus: "COMPLETED",
          workflowTask,
        };
      }

      if (workflowTask?.Name === "HighRiskCase") {
        return {
          OnboardingStatus: "HIGH_RISK",
          workflowTask,
        };
      }

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

export function useConfirmTermsConditions() {
  const { fetchLatestWorkflowTask, correlationId } = useOnboardingContext();

  return useMutation(async () => {
    if (undefined === correlationId) throw new Error("Cannot fetch customers/terms-conditions without `correlationId`");

    const workflowTask = await fetchLatestWorkflowTask();
    if (!workflowTask || workflowTask.Name !== "T&C")
      throw new Error("Available workflowTaskId is not applicable to customers/terms-conditions");

    return api<string>(
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

export function useFOBStatus(isFetching: boolean) {
  const { fetchLatestWorkflowTask } = useOnboardingContext();

  return useQuery(
    "FOBStatus",
    async () => {
      const workflowTask = await fetchLatestWorkflowTask();

      if (
        workflowTask?.Name === "T&C" ||
        workflowTask?.Name === "RetrievePersonalDetails" ||
        workflowTask?.Name === "MobileVerification"
      ) {
        const status = { OnboardingStatus: "COMPLETED" };

        return {
          ...status,
          workflowTask,
        };
      }

      return {
        OnboardingStatus: "PENDING",
        workflowTask,
      };
    },
    { refetchInterval: 2000, enabled: isFetching }
  );
}

export function useCreatePasscode() {
  const { fetchLatestWorkflowTask, correlationId } = useOnboardingContext();
  const { setAuthToken } = useAuthContext();

  return useMutation(
    async (passcode: string) => {
      if (!correlationId) throw new Error("Need valid `correlationId` to be available");
      const workflowTask = await fetchLatestWorkflowTask();
      if (!workflowTask || workflowTask.Name !== "CreatePasscode")
        throw new Error("Available workflowTaskId is not applicable to customers/update/passcode");

      return api<RegistrationResponse>(
        "v1",
        "customers/register",
        "POST",
        undefined,
        {
          Passcode: passcode,
        },
        {
          ["x-correlation-id"]: correlationId,
          ["x-workflow-task-id"]: workflowTask.Id,
        }
      );
    },
    {
      onSuccess(data) {
        setAuthToken(data.AccessToken);
      },
    }
  );
}

export function useGetCustomerPendingAction(statusId: StatusId) {
  const { correlationId } = useOnboardingContext();

  return useQuery(["CustomerPendingActions", statusId], () => {
    if (!correlationId) throw new Error("Need valid Correlation id");

    return api<Array<CustomerPendingAction>>("v1", `actions/${statusId}`, "GET", undefined, undefined, {
      ["x-correlation-id"]: correlationId,
    });
  });
}

export function useValidateMobileNo() {
  const { correlationId, fetchLatestWorkflowTask } = useOnboardingContext();
  const { i18n } = useTranslation();
  return useMutation(async (data: { nationalId: string; mobileNo: string }) => {
    if (!correlationId) throw new Error("Need valid Correlation id");

    const workflowTask = await fetchLatestWorkflowTask();
    if (!workflowTask || !workflowTask.Name) throw new Error("Need valid Work Flow Task id & Name");

    return api<IqamaResponse>(
      "v1",
      "customers/validate/mobile",
      "POST",
      undefined,
      {
        NationalId: data.nationalId,
        MobileNumber: data.mobileNo,
        NationalIdType: data.nationalId.match(nationalIdRegEx) ? NATIONAL_ID_TYPE : IQAMA_TYPE,
      },
      {
        ["X-Workflow-Task-Id"]: workflowTask.Id,
        ["x-correlation-id"]: correlationId,
        ["Accept-Language"]: i18n.language.toUpperCase(),
      }
    );
  });
}

export function useUpdateActionStatus() {
  const { correlationId } = useOnboardingContext();

  return useMutation(async (data: { ActionTypeId: string; StatusId: string }) => {
    if (!correlationId) throw new Error("Need valid Correlation id");

    return api<string>(
      "v1",
      "actions",
      "PUT",
      undefined,
      {
        ActionTypeId: data.ActionTypeId,
        StatusId: data.StatusId,
      },
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}

export function useGetCustomerTermsAndConditions(ContentCategoryId: string) {
  const { correlationId } = useOnboardingContext();
  const { i18n } = useTranslation();
  const queryParams: queryString.StringifiableRecord = { language: i18n.language, includeChildren: true };

  return useQuery(["CustomersTermsAndConditions", ContentCategoryId], () => {
    if (!correlationId) throw new Error("Need valid Correlation id");

    return api<CustomersTermsAndConditions>(
      "v1",
      `customers/terms-and-conditions/${ContentCategoryId}`,
      "GET",
      queryParams,
      undefined,
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}

export function useProceedToFob() {
  const { correlationId, fetchLatestWorkflowTask } = useOnboardingContext();
  const { i18n } = useTranslation();

  return useMutation(async (body: { IsProceedFOB: boolean }) => {
    if (!correlationId) throw new Error("Need valid Correlation id");
    const workflowTask = await fetchLatestWorkflowTask();

    if (!workflowTask || workflowTask.Name !== "CheckCustomeredAgreedOnFOB")
      throw new Error("Available workflowTaskId is not applicable to customers/fob/proceed/");

    return api<string>("v1", "customers/fob/proceed/", "POST", undefined, body, {
      ["x-correlation-id"]: correlationId,
      ["X-Workflow-Task-Id"]: workflowTask?.Id,
      ["Accept-Language"]: i18n.language.toUpperCase(),
    });
  });
}

export function useGetArbMicrositeUrl() {
  const { correlationId, fetchLatestWorkflowTask } = useOnboardingContext();
  const { i18n } = useTranslation();

  return useQuery(
    ["ArbMicrositeUrl"],
    async () => {
      if (!correlationId) throw new Error("Need valid Correlation id");
      const workflowTask = await fetchLatestWorkflowTask();

      if (!workflowTask || workflowTask.Name !== "GetMicrositeAuthStep")
        throw new Error("Available workflowTaskId is not applicable to customers/fob/microsite");

      return api<{ ArbMicrositeUrl: string }>("v1", `customers/fob/microsite`, "GET", undefined, undefined, {
        ["x-correlation-id"]: correlationId,
        ["X-Workflow-Task-Id"]: workflowTask?.Id,
        ["Accept-Language"]: i18n.language.toUpperCase(),
      });
    },
    { enabled: false }
  );
}

export function useFinalizeArbStep() {
  const { correlationId, fetchLatestWorkflowTask } = useOnboardingContext();
  const { i18n } = useTranslation();

  return useMutation(async (body: { IsFailedDetected: boolean; FailureDescription: string }) => {
    if (!correlationId) throw new Error("Need valid Correlation id");
    const workflowTask = await fetchLatestWorkflowTask();

    if (!workflowTask || workflowTask.Name !== "SubmitMicrositeAuthentication")
      throw new Error("Available workflowTaskId is not applicable to customers/fob/microsite");

    return api(
      "v1",
      "customers/fob/microsite",
      "POST",
      undefined,
      {
        ...body,
      },
      {
        ["x-correlation-id"]: correlationId,
        ["X-Workflow-Task-Id"]: workflowTask?.Id,
        ["Accept-Language"]: i18n.language.toUpperCase(),
      }
    );
  });
}

export function useCheckCustomerSelectionForMobileNumber() {
  const { correlationId, fetchLatestWorkflowTask, fobMobileNumber, mobileNumber } = useOnboardingContext();
  const { i18n } = useTranslation();

  return useMutation(async (body: { IsSameMobileNumber: boolean }) => {
    if (!correlationId) throw new Error("Need valid Correlation id");
    const workflowTask = await fetchLatestWorkflowTask();

    if (!workflowTask || workflowTask.Name !== "SelectARBMobileNumber")
      throw new Error("Available workflowTaskId is not applicable to customers/fob/mobile-number");

    return api(
      "v1",
      "customers/fob/mobile-number",
      "POST",
      undefined,
      {
        SelectedMobileNumber: body.IsSameMobileNumber ? fobMobileNumber : mobileNumber,
        ...body,
      },
      {
        ["x-correlation-id"]: correlationId,
        ["X-Workflow-Task-Id"]: workflowTask?.Id,
        ["Accept-Language"]: i18n.language.toUpperCase(),
      }
    );
  });
}

export function useRetriveHighRiskDocumentListByCustomerId() {
  const { correlationId } = useOnboardingContext();

  return useQuery(["retrieveCustomerDetails"], () => {
    if (!correlationId) throw new Error("Need valid Correlation id");

    return api<RetrieveUploadDocumentsListInterface>(
      "v1",
      "customers/required-documents/high-risk",
      "GET",
      undefined,
      undefined,
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}

export function useCheckHighRisk() {
  const { correlationId } = useOnboardingContext();

  return useQuery(["CheckHighRisk"], () => {
    if (!correlationId) throw new Error("Need valid Correlation id");
    return api<CheckHighRiskInterface>("v1", "customers/check/high-risk", "GET", undefined, undefined, {
      ["x-correlation-id"]: correlationId,
    });
  });
}

export function useCheckHighRiskStatus() {
  const { correlationId } = useOnboardingContext();

  return useQuery(
    ["CheckHighRiskStatus"],
    () => {
      if (!correlationId) throw new Error("Need valid Correlation id");
      return api<{ CaseStatus: string }>("v1", "customers/status/high-risk", "GET", undefined, undefined, {
        ["x-correlation-id"]: correlationId,
      });
    },
    {
      retry: true,
    }
  );
}

export function useUploadDocumentHighRisk() {
  const { correlationId } = useOnboardingContext();
  return useMutation((body: UploadDocumentHighRiskRequestInterface) => {
    if (!correlationId) throw new Error("Need valid Correlation id");
    return api<UploadDocumentHighRiskResponseInterface>(
      "v1",
      `customers/upload-document/high-risk`,
      "POST",
      undefined,
      body,
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}

export function useVerifyDocumentHighRisk() {
  const { correlationId } = useOnboardingContext();
  return useMutation(() => {
    if (!correlationId) throw new Error("Need valid Correlation id");
    return api("v1", `customers/verify-documents/high-risk`, "POST", undefined, undefined, {
      ["x-correlation-id"]: correlationId,
    });
  });
}

export function useDownloadHighRiskDocument() {
  const { correlationId } = useOnboardingContext();

  return useMutation((caseAnnotationId: string) => {
    if (!correlationId) throw new Error("Need valid Correlation id");
    return api<DownloadHighRiskDocumentResponse>(
      "v1",
      `customers/download-document/${caseAnnotationId}/high-risk`,
      "GET",
      undefined,
      undefined,
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}

export function useSendOnboardingOTP() {
  const { correlationId, fetchLatestWorkflowTask } = useOnboardingContext();

  return useMutation(async () => {
    if (!correlationId) throw new Error("Need valid Correlation id");
    const workflowTask = await fetchLatestWorkflowTask();

    if (!workflowTask) throw new Error("Available workflowTaskId is not applicable to onboarding/otp");

    return api<SendOnboardingOtpResponse>(
      "v1",
      "customers/onboarding-otp/send",
      "POST",
      undefined,
      {
        Reason: "156",
      },
      {
        ["x-correlation-id"]: correlationId,
        ["Accept-Language"]: i18next.language.toUpperCase(),
        ["X-Workflow-Task-Id"]: workflowTask?.Id,
      }
    );
  });
}
