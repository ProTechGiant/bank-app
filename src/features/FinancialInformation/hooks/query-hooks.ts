import DeviceInfo from "react-native-device-info";
import { useMutation, useQueryClient } from "react-query";

import api from "@/api";
import { queryKeys } from "@/hooks/use-customer-profile";
import { generateRandomId } from "@/utils";

import { FinancialDetails } from "../types";

export function useSubmitFinancialDetails() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values: FinancialDetails[]) => {
      return api("v1", `customers/financial-info`, "PATCH", undefined, values, {
        ["x-correlation-id"]: generateRandomId(),
        ["x-device-id"]: DeviceInfo.getDeviceId(),
        // TODO: This should come from Auth Context
        ["Authorization"]: generateRandomId(),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.all());
      },
    }
  );
}
