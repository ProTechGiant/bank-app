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
