import DeviceInfo from "react-native-device-info";
import { useMutation, useQueryClient } from "react-query";

import api from "@/api";
import { queryKeys as customerProfileQueryKeys } from "@/hooks/use-customer-profile";
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
