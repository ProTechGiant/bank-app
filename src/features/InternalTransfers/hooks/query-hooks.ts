import { useMutation, useQuery } from "react-query";

import api from "@/api";
import sendApiRequest from "@/api";
import { generateRandomId } from "@/utils";

import { BeneficiaryType, TransferReason } from "../types";

interface ReasonsResponse {
  TransferReason: TransferReason[];
}

interface BeneficiariesResponse {
  Beneficiary: BeneficiaryType[];
}

export function useTransferReasons() {
  const reasons = useQuery(["personalReason"], () => {
    return api<ReasonsResponse>("v1", "payments/reason-for-payment", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      // TODO: Remove hardcoded UserId once login is hooked up
      ["UserId"]: "301",
    });
  });

  return reasons.data;
}

export function useBeneficiaries() {
  const beneficiaries = useQuery("Beneficiaries", () => {
    return api<BeneficiariesResponse>("v1", "payments/beneficiaries", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      // TODO: Remove hardcoded UserId once login is hooked up
      ["UserId"]: "10007",
    });
  });

  return beneficiaries;
}

export function useDeleteBeneficiary() {
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
        ["UserId"]: "10007",
      }
    );
  });
}
