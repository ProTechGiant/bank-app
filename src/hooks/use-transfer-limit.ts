import { useQuery } from "react-query";

import api from "@/api";
import { TRANSFER_PRODUCT_MAP } from "@/features/InternalTransfers/types";
import { TransferType } from "@/types/InternalTransfer";
import { generateRandomId } from "@/utils";

const queryKeys = {
  all: () => ["transfers"] as const,
  transferLimit: (productType: string | undefined) => [...queryKeys.all(), "transferLimit", { productType }] as const,
};

interface TransferLimitResponse {
  AvailableProductLimit: number;
  AvailableProductCount: number;
  MaxProductTransactionAmount: number;
  AvailableGlobalLimit: number;
  GlobalLimit: number;
  ProductLimit: number;
}

export function useTransferLimitAmount(transferType: TransferType) {
  const productType = TRANSFER_PRODUCT_MAP[transferType];
  return useQuery(queryKeys.transferLimit(productType), () => {
    return api<TransferLimitResponse>("v1", `limit/customer?productType=${productType}`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}
