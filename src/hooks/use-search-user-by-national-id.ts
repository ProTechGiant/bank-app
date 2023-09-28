import DeviceInfo from "react-native-device-info";
import { useMutation } from "react-query";

import sendApiRequest from "@/api";
import { useSignInContext } from "@/features/SignIn/contexts/SignInContext";

export interface UserType {
  TotalRecords: number;
  IsvaUserId: string;
  NationalId: string;
  AccountValid: boolean;
  UserName: string;
  DeviceId: string;
  DeviceName: string;
  DeviceStatus: string;
  MobileNumber: string;
  CustomerId: string;
  CustomerName: string;
  Email: string;
}

export function useSearchUserByNationalId() {
  const { correlationId } = useSignInContext();
  return useMutation(async ({ NationalId, MobileNumber }: { NationalId: string; MobileNumber: string }) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    return sendApiRequest<UserType>(
      "v2",
      "customers/search",
      "POST",
      undefined,
      {
        NationalId,
        MobileNumber,
      },
      {
        ["x-Correlation-Id"]: correlationId,
        ["x-device-name"]: await DeviceInfo.getDeviceName(),
      }
    );
  });
}
