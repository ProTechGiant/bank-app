import { useMutation, useQuery } from "react-query";

import api from "@/api";
import sendApiRequest from "@/api";
import { generateRandomId } from "@/utils";

import {
  AddBeneficiarySelectionType,
  Bank,
  BeneficiaryType,
  InternalTransfer,
  QuickTransfer,
  TRANSFER_BENEFICIARY_MAP,
  TransferReason,
  TransferType,
} from "../types";

const queryKeys = {
  all: () => ["transfers"] as const,
  reasons: (transferType: TransferType) => [...queryKeys.all(), "reasons", { transferType }] as const,
  beneficiaries: (transferType: TransferType) => [...queryKeys.all(), "beneficiaries", { transferType }] as const,
  banks: () => [...queryKeys.all(), "banks"] as const,
  transferFees: (transferType: string) => [...queryKeys.all(), "transfer-fees", { transferType }] as const,
};

interface ReasonsResponse {
  TransferReason: TransferReason[];
}

interface BeneficiariesResponse {
  Beneficiary: BeneficiaryType[];
}

export function useTransferReasons(transferType: TransferType) {
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

export function useBeneficiaries(transferType: TransferType) {
  return useQuery(queryKeys.beneficiaries(transferType), () => {
    return api<BeneficiariesResponse>(
      "v1",
      "transfers/beneficiaries",
      "GET",
      transferType ? { beneficiaryType: TRANSFER_BENEFICIARY_MAP[transferType] } : undefined,
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
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
      BeneficiaryTransferType,
    }: {
      SelectionType: AddBeneficiarySelectionType;
      SelectionValue: string;
      BeneficiaryTransferType: TransferType;
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
          BeneficiaryType: TRANSFER_BENEFICIARY_MAP[BeneficiaryTransferType],
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

export function useTransferFees(transferType: string) {
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

export function useTransferReasonsByCode(reasonCode: string, transferType: TransferType) {
  const reasons = useTransferReasons(transferType);

  return { ...reasons, data: reasons?.data?.TransferReason.find(reason => reason.Code === reasonCode) };
}

interface QuickTransferResponse {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
}

export function useQuickTransfer() {
  return useMutation(async (values: QuickTransfer) => {
    return sendApiRequest<QuickTransferResponse>("v1", "transfers/outbound/local", "POST", undefined, values, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

interface AddBeneficiaryLocalTranferResponse {
  Name: string;
  BankAccountNumber?: string;
  IBAN?: string;
  PhoneNumber?: string;
}

export function useAddBeneficiaryLocalTranfer() {
  return useMutation(
    async ({
      SelectionType,
      SelectionValue,
      BeneficiaryName,
      BeneficiaryTransferType,
    }: {
      SelectionType: string;
      SelectionValue: string;
      BeneficiaryName: string;
      BeneficiaryTransferType: string;
    }) => {
      return api<AddBeneficiaryLocalTranferResponse>(
        "v1",
        "transfers/beneficiaries",
        "POST",
        undefined,
        {
          SelectionType: SelectionType,
          SelectionValue: SelectionValue,
          BeneficiaryType: BeneficiaryTransferType,
          BeneficiaryName: BeneficiaryName,
        },
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      );
    }
  );
}

interface GetBankNameFromIBANResponse {
  BankName: string;
}
export function useBankDetailWithIBAN() {
  return useMutation(async ({ iban }: { iban: string }) => {
    return api<GetBankNameFromIBANResponse>("v1", "transfers/beneficiaries/bank/" + iban, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}
