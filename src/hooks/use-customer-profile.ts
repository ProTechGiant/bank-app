import { useTranslation } from "react-i18next";
import DeviceInfo from "react-native-device-info";
import { useQuery } from "react-query";

import sendApiRequest from "@/api";
import { FetchCustomerProfileInterface } from "@/types/CustomerProfile";
import { generateRandomId } from "@/utils";

export const queryKeys = {
  all: () => ["customerProfileData"] as const,
};

export function useCustomerProfile() {
  const { i18n } = useTranslation();

  return useQuery(queryKeys.all(), () => {
    return sendApiRequest<FetchCustomerProfileInterface>("v1", `customers`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["x-device-id"]: DeviceInfo.getDeviceId(),
      ["Authorization"]: generateRandomId(), // TODO: This should come from Auth Context
      ["Accept-Language"]: i18n.language.toUpperCase(),
    });
  });
}
