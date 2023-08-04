import { useTranslation } from "react-i18next";
import DeviceInfo from "react-native-device-info";
import { useMutation, useQueryClient } from "react-query";

import api from "@/api";
import { queryKeys as customerProfileQueryKeys } from "@/hooks/use-customer-profile";
import { FetchCustomerProfileInterface } from "@/types/CustomerProfile";
import { generateRandomId } from "@/utils";

interface UpdateEmailInput {
  EmailAddress: string;
}

interface UpdateMobileNumberInput {
  MobileNumber: string;
  SpecifiedOtp: string;
  OtpReasonCode: string;
}

interface UpdateCommunicationDetailsResponse {
  MobilePhone: string;
  Email: string;
  LangCode: string;
}

export function useUpdateCustomerProfileDetails() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values: UpdateEmailInput | (UpdateEmailInput & UpdateMobileNumberInput)) => {
      return api<UpdateCommunicationDetailsResponse>(
        "v1",
        "customers/communication-details",
        "PATCH",
        undefined,
        values,
        {
          ["x-correlation-id"]: generateRandomId(),
          ["x-device-id"]: DeviceInfo.getDeviceId(),
          ["Authorization"]: generateRandomId(), // TODO: This should come from Auth Context
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(customerProfileQueryKeys.all());
      },
    }
  );
}

export function useUpdateCustomerProfileIdExpiryDate() {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  return useMutation(
    async () => {
      return api<FetchCustomerProfileInterface>("v1", "customers/initial-profile", "POST", undefined, undefined, {
        ["x-correlation-id"]: generateRandomId(),
        ["x-device-id"]: DeviceInfo.getDeviceId(),
        ["Authorization"]: generateRandomId(), // TODO: This should come from Auth Context
        ["Accept-Language"]: i18n.language.toLowerCase(),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(customerProfileQueryKeys.all());
      },
    }
  );
}
