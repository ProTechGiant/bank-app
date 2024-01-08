import { TransferLimitResponse } from "@/hooks/use-transfer-limit";
import { TransferType } from "@/types/InternalTransfer";

import { TransferBeneficiaryType } from "../types";

export function formatContactNumber(phoneNumber: string) {
  // Remove special characters and spaces
  const cleanedNumber = phoneNumber.replace(/[^\d]/g, "");

  // Extract the last 9 digits
  return cleanedNumber.slice(-9);
}

export function formatContactNumberToSaudi(phoneNumber: string) {
  // Insert spaces or other formatting characters
  const formattedNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");

  // Add '+966' at the beginning
  return "+966 " + formattedNumber;
}

export function getKeyByValue(
  obj: Record<TransferType, TransferBeneficiaryType>,
  searchValue: TransferBeneficiaryType
): string | null {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] === searchValue) {
      return key;
    }
  }
  // Return null if the value is not found in the object
  return null;
}

export function getMinimumTransferLimit(limitData?: TransferLimitResponse): number {
  return Math.min(
    limitData?.AvailableProductLimit ?? 0,
    limitData?.AvailableGlobalLimit ?? 0,
    limitData?.MaxProductTransactionAmount ?? 0
  );
}

export function isLimitReached(currentAmount: number, limitData?: TransferLimitResponse): boolean {
  return (
    currentAmount > parseInt(limitData?.AvailableProductLimit, 10) ||
    currentAmount > parseInt(limitData?.AvailableGlobalLimit, 10) ||
    (limitData?.AvailableProductCount ?? 0) === 0
  );
}
