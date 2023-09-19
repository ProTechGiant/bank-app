import DeviceInfo from "react-native-device-info";
import { useMutation } from "react-query";

import sendApiRequest from "@/api";
import { useSignInContext } from "@/features/SignIn/contexts/SignInContext";

export interface UserType {
  TotalRecords: number;
  UserId: string;
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

//TODO: just for test, will remove when API is ready
const mockUserMatch = {
  TotalRecords: 1,
  isvauserId: "NTY3ODkzNDU3Ng",
  NationalId: "1234567890",
  AccountValid: true,
  UserName: "match",
  DeviceId: DeviceInfo.getDeviceId(),
  DeviceName: DeviceInfo.getDeviceName(),
  DeviceStatus: "R",
  MobileNumber: "+966599999999",
  CustomerId: "1032456745",
  CustomerName: "Ram Gupta",
  Email: "ram.gupta@email.com",
};

const mockUserNotMatchDevice = {
  TotalRecords: 1,
  isvauserId: "NTY3ODkzNDU3Ng",
  NationalId: "1234567890",
  AccountValid: true,
  UserName: "match",
  DeviceId: DeviceInfo.getDeviceId() + 1,
  DeviceName: DeviceInfo.getDeviceName(),
  DeviceStatus: "R",
  MobileNumber: "+966599999999",
  CustomerId: "1032456745",
  CustomerName: "Ram Gupta",
  Email: "ram.gupta@email.com",
};

const mockUserNotMatch = {
  TotalRecords: 0,
  DeviceId: "",
  DeviceStatus: "",
};

export function useSearchUserByNationalId() {
  const { correlationId } = useSignInContext();
  return useMutation(async ({ NationalId, MobileNumber }: { NationalId: string; MobileNumber: string }) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");
    //TODO: just for test , will remove switch when API is ready
    switch (NationalId) {
      case "1234567890":
        return mockUserMatch;
      case "1234567891":
        return mockUserNotMatch;
      case "1234567892":
        return mockUserNotMatchDevice;
      default:
        return sendApiRequest<UserType>(
          "v1",
          "customers/search",
          "POST",
          undefined,
          {
            NationalId,
            MobileNumber,
          },
          {
            ["x-Correlation-Id"]: correlationId,
            ["DeviceId"]: DeviceInfo.getDeviceId(),
            ["DeviceName"]: await DeviceInfo.getDeviceName(),
          }
        );
    }
  });
}
