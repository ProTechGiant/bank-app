import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { AddBillInterface } from "../types";
import { BillerCategory } from "../types";

const queryKeys = {
  all: () => ["bills"] as const,
  categoriesWithBillers: (pageSize: number, pageNumber: number) => [
    ...queryKeys.all(),
    "categories",
    { pageSize, pageNumber },
  ],
  paymentHistory: () => [...queryKeys.all(), "payment-history"] as const,
};

interface BillerCategoryResponse {
  CategoriesList: Array<BillerCategory>;
}

export function useBillerCategories(pageSize: number, pageNumber: number) {
  return useQuery(queryKeys.categoriesWithBillers(pageSize, pageNumber), () => {
    return api<BillerCategoryResponse>(
      "v1",
      "payments/sadad/billers",
      "GET",
      { pageSize: pageSize, pageNumber: pageNumber },
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}

interface SavedBill {
  BillInfo: {
    BillerId: string;
    BillAmt: number;
    BillDueDt: string;
    BillNumber: string;
    BillingAccount: string;
    BillDescAr: string;
    BillDescEn: string;
    BillerLogoUrl: string;
  };
}
interface SavedBills {
  BillList: SavedBill[];
}

export function useSavedBills() {
  const { i18n } = useTranslation();
  return useQuery(
    queryKeys.all(),
    () => {
      return api<SavedBills>("v1", "payments/sadad/bills/details", "GET", undefined, undefined, {
        ["x-correlation-id"]: generateRandomId(),
      });
    },
    {
      select: React.useCallback(
        (data: SavedBills) =>
          data.BillList.map(({ BillInfo }) => {
            return {
              BillName: i18n.language === "en" ? BillInfo.BillDescEn : BillInfo.BillDescAr,
              AccountNumber: BillInfo.BillingAccount,
              Amount: BillInfo.BillAmt,
              DueDate: BillInfo.BillDueDt,
              iconUrl: BillInfo.BillerLogoUrl,
              BillerId: BillInfo.BillerId,
            };
          }),
        [i18n.language]
      ),
    }
  );
}

interface BillPayment {
  PmtInfo: {
    BillDescriptionEn: string;
    BillDescriptionAr: string;
    PaymentId: string;
    BillerId: string;
    PaymentAmount: number;
    PaymentAmountCurrency: string;
    BillAmountCurrency: string;
    BillAmount: number;
    PaymentDate: string;
    PaymentStatus: string;
    BillerLogoUrl: string;
    BillingAccount: string;
  };
}
interface BillPayments {
  PmtList: BillPayment[];
}

export function useBillPaymentHistory() {
  const { i18n } = useTranslation();
  return useQuery(
    queryKeys.paymentHistory(),
    () => {
      return api<BillPayments>("v1", "payments/sadad/payment-history", "GET", undefined, undefined, {
        ["x-correlation-id"]: generateRandomId(),
      });
    },
    {
      select: React.useCallback(
        (data: BillPayments) =>
          data.PmtList.map(({ PmtInfo }) => {
            return {
              BillName: i18n.language === "en" ? PmtInfo.BillDescriptionEn : PmtInfo.BillDescriptionAr,
              AccountNumber: PmtInfo.BillingAccount,
              Amount: PmtInfo.BillAmount,
              DueDate: PmtInfo.PaymentDate,
              iconUrl: PmtInfo.BillerLogoUrl,
              BillerId: PmtInfo.BillerId,
            };
          }),
        [i18n.language]
      ),
    }
  );
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

interface AddBillResponse {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
}

export function useAddBill() {
  return useMutation(async (values: AddBillInterface) => {
    return api<AddBillResponse>("v1", "payments/sadad/bill/association", "POST", undefined, values, {
      ["x-correlation-id"]: generateRandomId(),
    });
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
