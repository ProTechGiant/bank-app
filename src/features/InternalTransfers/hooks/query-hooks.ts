import { useMutation, useQuery } from "react-query";

import api from "@/api";
import sendApiRequest from "@/api";
import { generateRandomId } from "@/utils";

import { AddBeneficiarySelectionType, BeneficiaryType, InternalTransfer, TransferReason } from "../types";

const queryKeys = {
  all: () => ["transfers"] as const,
  reasons: () => [...queryKeys.all(), "reasons"] as const,
  beneficiaries: () => [...queryKeys.all(), "beneficiaries"] as const,
  banks: () => [...queryKeys.all(), "banks"] as const,
};

interface ReasonsResponse {
  TransferReason: TransferReason[];
}

interface BeneficiariesResponse {
  Beneficiary: BeneficiaryType[];
}

export function useTransferReasons() {
  return useQuery(queryKeys.reasons(), () => {
    return api<ReasonsResponse>("v1", "transfers/reason-for-payment", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
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
  Banks: Array<{
    EnglishName: string;
    BankId: string;
    BankCode: string;
    BankShortName: string;
    Active: boolean;
  }>;
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
