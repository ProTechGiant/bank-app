import { useTranslation } from "react-i18next";
import DeviceInfo from "react-native-device-info";
import { useMutation, useQueryClient } from "react-query";

import api from "@/api";
import { OtpChallengeParams } from "@/features/OneTimePassword/types";
import { queryKeys as customerProfileQueryKeys } from "@/hooks/use-customer-profile";
import { FetchCustomerProfileInterface } from "@/types/CustomerProfile";
import { generateRandomId } from "@/utils";

interface UpdateEmailInput {
  EmailAddress: string;
}

interface UpdateCommunicationDetailsResponse {
  MobilePhone: string;
  Email: string;
  LangCode: string;
}
interface RequestCustomerProfileOTPParameters {
  OtpReasonCode: string;
  MobileNumber: string;
}

export function useUpdateCustomerProfileDetails() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values: UpdateEmailInput) => {
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

export function useUpdateCustomerProfileOTP() {
  const { i18n } = useTranslation();

  return useMutation(async (values: RequestCustomerProfileOTPParameters) => {
    return api<OtpChallengeParams>(
      "v1",
      `customers/opts/${values.OtpReasonCode}`,
      "PATCH",
      undefined,
      {
        MobileNumber: values.MobileNumber,
      },
      {
        ["x-correlation-id"]: generateRandomId(),
        ["x-device-id"]: DeviceInfo.getDeviceId(),
        ["Authorization"]: generateRandomId(), // TODO: This should come from Auth Context
        ["Accept-Language"]: i18n.language,
      }
    );
  });
}

// this constant related to update mobile phone check https://collab.dtme.dev/display/PC/LLD%3A+OTP#LLD:OTP-OTPReasonCodes for more info
export const UPDATE_CUSTOMER_PROFILE_OTP_REASON_CODE = "125";
