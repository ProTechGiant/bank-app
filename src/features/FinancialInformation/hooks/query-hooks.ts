import DeviceInfo from "react-native-device-info";
import { useMutation } from "react-query";

import sendApiRequest from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import { FinancialDetails } from "../types";

export function useSubmitFinancialDetails() {
  const correlationId = generateRandomId();
  const { userId } = useAuthContext();

  return useMutation(async (values: FinancialDetails) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    return sendApiRequest<string>(
      "v1",
      "customers/notifications/financial-info",
      "PATCH",
      { ...values },
      {
        ["x-correlation-id"]: correlationId,
        ["deviceId"]: DeviceInfo.getDeviceId(),
        ["userId"]: userId,
        //TODO: temporarily this is based on the backend's team request, the API is not stable until this moment
        ["authorization"]: "564c0148-56a1-11ed-9b6a-0242ac120002",
      }
    );
  });
}
