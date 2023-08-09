import { format, parse } from "date-fns";
import { I18nManager } from "react-native";

import { OTP_BLOCKED_TIME } from "@/constants";
import { Address } from "@/types/CustomerProfile";
import { setItemInEncryptedStorage } from "@/utils/encrypted-storage";

export const parseCustomerAddress = (address: Address) => {
  const separator = I18nManager.isRTL ? "، " : ", ";

  if (I18nManager.isRTL) {
    return `${address.CountryCode}${separator}${address.Postcode} ${address.CityCode}${separator}${address.StreetName}`;
  } else {
    return `${address.StreetName}${separator}${address.CityCode} ${address.Postcode}${separator}${address.CountryCode}`;
  }
};

export const parseCustomerCivilianIDExpiryDate = (dateString: string) => {
  const date = parse(dateString, "M/d/yyyy h:mm:ss a", new Date());
  const formattedDate = format(date, "dd/MM/yyyy");
  return formattedDate;
};

export const markUserAsBlocked = async () => {
  const userBlockTime = new Date().getTime() + OTP_BLOCKED_TIME * 60 * 1000;
  await setItemInEncryptedStorage("UserBlocked", JSON.stringify(userBlockTime));
  await setItemInEncryptedStorage("UserBlockedFromProfileDetails", JSON.stringify(true));
};
