import { useMutation, useQuery } from "react-query";

import api from "@/api";
import sendApiRequest from "@/api";
import { generateRandomId } from "@/utils";

import { AddBeneficiarySelectionType, BeneficiaryType, InternalTransfer, TransferReason } from "../types";

interface ReasonsResponse {
  TransferReason: TransferReason[];
}

interface BeneficiariesResponse {
  Beneficiary: BeneficiaryType[];
}

export function useTransferReasons() {
  return useQuery(["personalReason"], () => {
    return api<ReasonsResponse>("v1", "transfers/reason-for-payment", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

export function useBeneficiaries() {
  const beneficiaries = useQuery("Beneficiaries", () => {
    return api<BeneficiariesResponse>("v1", "transfers/beneficiaries", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });

  return beneficiaries;
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
