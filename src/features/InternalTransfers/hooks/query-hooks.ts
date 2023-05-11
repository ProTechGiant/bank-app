import { useMutation, useQuery } from "react-query";

import api from "@/api";
import sendApiRequest from "@/api";
import { generateRandomId } from "@/utils";

import {
  AddBeneficiarySelectionType,
  Bank,
  BeneficiaryType,
  InternalTransfer,
  TransferReason,
  TransferType,
} from "../types";

const queryKeys = {
  all: () => ["transfers"] as const,
  reasons: (transferType: number) => [...queryKeys.all(), "reasons", { transferType }] as const,
  beneficiaries: () => [...queryKeys.all(), "beneficiaries"] as const,
  banks: () => [...queryKeys.all(), "banks"] as const,
  transferFees: (transferType: string) => [...queryKeys.all(), "transfer-fees", { transferType }] as const,
};

interface ReasonsResponse {
  TransferReason: TransferReason[];
}

interface BeneficiariesResponse {
  Beneficiary: BeneficiaryType[];
}

// Transfer Types: QuickOrStandardType: 110 | InternalTransfer: 100;
export function useTransferReasons(transferType: number) {
  return useQuery(queryKeys.reasons(transferType), () => {
    return api<ReasonsResponse>(
      "v1",
      `transfers/reason-for-payment`,
      "GET",
      { transferType: transferType },
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}

interface DailyLimitResponse {
  IsLimitExceeded: boolean;
  DailyLimit: number;
  ExceededAmount: number;
}
export function useDailyLimitValidation() {
  return useMutation(async ({ TransferAmount }: { TransferAmount: number }) => {
    return sendApiRequest<DailyLimitResponse>(
      "v1",
      "transfers/daily-limit/validation",
      "POST",
      undefined,
      {
        TransferAmount: TransferAmount,
      },
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}

export function useBeneficiaries() {
  return useQuery(queryKeys.beneficiaries(), () => {
    return api<BeneficiariesResponse>("v1", "transfers/beneficiaries", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

export function useDeleteBeneficiary() {
  return useMutation(async ({ name, accountNumber }: { name: string; accountNumber: string }) => {
    return sendApiRequest<string>(
      "v1",
      "transfers/beneficiaries/delete",
      "PATCH",
      undefined,
      {
        BeneficiaryName: name,
        BeneficiaryAccountNumber: accountNumber,
      },
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}

interface AddBeneficiaryResponse {
  Name: string;
  BankAccountNumber?: string;
  IBAN?: string;
  PhoneNumber?: string;
}

export function useAddBeneficiary() {
  return useMutation(
    async ({
      SelectionType,
      SelectionValue,
    }: {
      SelectionType: AddBeneficiarySelectionType;
      SelectionValue: string;
    }) => {
      // remove country code in mobile phone number
      const inputValue =
        SelectionType === "mobileNo" ? SelectionValue.substring(SelectionValue.length, 4) : SelectionValue;

      return api<AddBeneficiaryResponse>(
        "v1",
        "transfers/beneficiaries",
        "POST",
        undefined,
        {
          SelectionType: SelectionType,
          SelectionValue: inputValue,
        },
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      );
    }
  );
}

interface InternalTransferResponse {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
}

export function useInternalTransfer() {
  return useMutation(async (values: InternalTransfer) => {
    return sendApiRequest<InternalTransferResponse>("v1", "transfers/internal-payments", "POST", undefined, values, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

interface BeneficiaryBanksResponse {
  Banks: Array<Bank>;
}

export function useBeneficiaryBanks() {
  return useQuery(
    queryKeys.banks(),
    () => {
      return sendApiRequest<BeneficiaryBanksResponse>("v1", "transfers/banks", "GET", undefined, undefined, {
        ["x-correlation-id"]: generateRandomId(),
      });
    },
    {
      cacheTime: Infinity,
    }
  );
}

interface QuickTransferAccountsResponse {
  CustomerTermsConditionsFlag: "0" | "1";
}

export function useQuickTransferAccounts() {
  return useQuery(["QuickTransferActivation"], () => {
    return api<QuickTransferAccountsResponse>("v1", "transfers/accounts", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

interface QuickTransferTermsAndConditionResponse {
  CustomerTermsConditionsFlag: string;
}

export function useConfirmQuickTransferTermsAndConditions() {
  return useMutation(async ({ CustomerTermsConditionsFlag }: { CustomerTermsConditionsFlag: string }) => {
    return api<QuickTransferTermsAndConditionResponse>(
      "v1",
      "transfers/quick/tc",
      "PATCH",
      undefined,
      {
        CustomerTermsConditionsFlag: CustomerTermsConditionsFlag,
      },
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}

interface TransferFeesResponse {
  TransferFee: string;
}

export function useTransferFees(transferType: TransferType) {
  return useQuery(queryKeys.transferFees(transferType), () => {
    return api<TransferFeesResponse>(
      "v1",
      "transfers",
      "POST",
      undefined,
      {
        TransferType: transferType,
      },
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}

interface ValidateQuickTransferBeneficiaryResponse {
  SelectionType: string;
  SelectionValue: string;
  Bank: Bank;
  FullName: string;
  IBAN: string;
}

export function useValidateQuickTransferBeneficiary() {
  return useMutation(
    async ({
      SelectionType,
      SelectionValue,
      bank,
      name,
    }: {
      SelectionType: AddBeneficiarySelectionType;
      SelectionValue: string;
      bank: Bank;
      name: string | undefined;
    }) => {
      // remove country code in mobile phone number
      const inputValue =
        SelectionType === "mobileNo" ? SelectionValue.substring(SelectionValue.length, 4) : SelectionValue;

      return api<ValidateQuickTransferBeneficiaryResponse>(
        "v1",
        "transfers/quick/beneficiaries",
        "POST",
        undefined,
        {
          SelectionType: SelectionType,
          SelectionValue: inputValue,
          Bank: bank,
          FullName: name,
        },
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      );
    }
  );
}

export function useTransferReasonsByCode(reasonCode: string, transferType: number) {
  const reasons = useTransferReasons(transferType);

  return { ...reasons, data: reasons?.data?.TransferReason.find(reason => reason.Code === reasonCode) };
}
