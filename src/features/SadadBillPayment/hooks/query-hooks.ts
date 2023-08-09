import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { BillerCategory } from "../types";

const queryKeys = {
  all: () => ["data"] as const,
  categoriesWithBillers: () => [...queryKeys.all()],
};

interface BillerCategoryResponse {
  CategoriesList: Array<BillerCategory>;
}

export function useBillerCategories() {
  return useQuery(queryKeys.categoriesWithBillers(), () => {
    return api<BillerCategoryResponse>(
      "v1",
      "payments/sadad/billers",
      "GET",
      // TODO: Pagination will be handled in separate PR
      { pageSize: 1000, pageNumber: 0 },
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}

export interface UpdateBillDescriptionProps {
  BillId: string;
  BillDescriptionEn: string;
}

export function useUpdateBillDescription() {
  return useMutation((options: UpdateBillDescriptionProps) => {
    const { BillId, ...requestBody } = options;
    return api<UpdateBillDescriptionProps>(
      "v1",
      `payments/sadad/bills/${BillId}/details`,
      "PATCH",
      undefined,
      { ...requestBody },
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}

export function useEditBillDescription() {
  const { i18n } = useTranslation();
  return useMutation(async ({ billId, billDescription }: { billId: string; billDescription: string }) => {
    return api(
      "v1",
      `payments/sadad/bills/${billId}/details`,
      "PATCH",
      undefined,
      i18n.language === "en" ? { BillDescriptionEn: billDescription } : { BillDescriptionAr: billDescription },
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}

interface DeleteSavedBillParams {
  billId: string;
  accountNumber: string;
}
interface BillDetailsResponse {
  BillDescriptionEn: string;
  BillDescriptionAr: string;
  BillerDescriptionEn: string;
  BillerDescriptionAr: string;
  BillerCode: string;
  BillAmount: string;
  BillAmountCurrency: string;
  PaymentAmount: string;
  PaymentAmountCurrency: string;
  PaymentDate: string;
  AccountNumber: string;
  ReferenceNumber: string;
  PaymentStatus: string;
  BillerLogoUrl: string;
}
export function useDeleteSavedBill() {
  return useMutation(async ({ billId, accountNumber }: DeleteSavedBillParams) => {
    return api("v1", `payments/sadad/bills/${billId}/details`, "DELETE", undefined, accountNumber, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

export function useBillPaymentHistoryDetail(paymentID: string) {
  return useQuery(paymentID, () => {
    return api<BillDetailsResponse>("v1", `payments/sadad/payment-history/${paymentID}`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}
