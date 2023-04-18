import { useMutation, useQuery } from "react-query";

import api from "@/api";
import sendApiRequest from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import { BeneficiaryType, TransferReason } from "../types";

interface ReasonsResponse {
  TransferReason: TransferReason[];
}

interface BeneficiariesResponse {
  Beneficiary: BeneficiaryType[];
}

export function useTransferReasons() {
  const { userId } = useAuthContext();

  const reasons = useQuery(["personalReason"], () => {
    return api<ReasonsResponse>("v1", "payments/reason-for-payment", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      // TODO: Remove hardcoded UserId once login is hooked up
      ["UserId"]: userId || "10007",
    });
  });

  return reasons.data;
}

export function useBeneficiaries() {
  const { userId } = useAuthContext();

  const beneficiaries = useQuery("Beneficiaries", () => {
    return api<BeneficiariesResponse>("v1", "payments/beneficiaries", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      // TODO: Remove hardcoded UserId once login is hooked up
      ["UserId"]: userId || "10007",
    });
  });

  return beneficiaries;
}

export function useDeleteBeneficiary() {
  const { userId } = useAuthContext();

  return useMutation(async ({ name, accountNumber }: { name: string; accountNumber: string }) => {
    return sendApiRequest<string>(
      "v1",
      "payments/beneficiaries/delete",
      "PATCH",
      undefined,
      {
        BeneficiaryName: name,
        BeneficiaryAccountNumber: accountNumber,
      },
      {
        ["x-correlation-id"]: generateRandomId(),
        // TODO: Remove hardcoded UserId once login is hooked up
        ["UserId"]: userId || "10007",
      }
    );
  });
}

interface AddBeneficiaryResponse {
  Name: "string";
  BankAccountNumber?: "string";
  IBAN?: "string";
  PhoneNumber?: "string";
}

export function useAddBeneficiary() {
  const { userId } = useAuthContext();

  return useMutation(async ({ SelectionType, SelectionValue }: { SelectionType: string; SelectionValue: string }) => {
    return api<AddBeneficiaryResponse>(
      "v1",
      "payments/beneficiaries",
      "POST",
      undefined,
      {
        SelectionType: SelectionType,
        SelectionValue: SelectionValue,
      },
      {
        ["x-correlation-id"]: generateRandomId(),
        ["UserId"]: userId || "10007", // TODO: Remove hardcoded UserId once login is hooked up
      }
    );
  });
}
