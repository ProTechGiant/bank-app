import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

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
