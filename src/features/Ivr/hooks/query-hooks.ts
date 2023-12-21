import DeviceInfo from "react-native-device-info";
import { useMutation } from "react-query";

import sendApiRequest from "@/api";

import { IvrWaitingApiInputInterface } from "../types";

export function useIvrWaitingApi() {
  return useMutation(async (input: IvrWaitingApiInputInterface) => {
    if (!input.correlationId) throw new Error("Need valid `correlationId` to be available");

    if (input.flow === "onboarding") {
      if (!input.workflowTask || input.workflowTask.Name !== "CreatePasscode")
        throw new Error("Available workflowTaskId is not applicable to customers/update/passcode");

      return sendApiRequest(
        "v1",
        input.apiPath,
        "POST",
        undefined,
        {
          NationalId: input.nationalId,
          MobileNumber: input.mobileNumber,
          CustomerName: "Mohamed Ahmed",
          Email: "mohamed.ahmed@domain.com",
          Passcode: input.passcode,
        },
        {
          ["x-correlation-id"]: input.correlationId,
          ["x-workflow-task-id"]: input.workflowTask.Id,
          ["x-forwarded-for"]: DeviceInfo.getIpAddressSync(),
          ["x-device-model"]: DeviceInfo.getModel(),
          ["x-device-os-version"]: DeviceInfo.getVersion(),
          ["x-device-location"]: "Multan",
        }
      );
    }

    return sendApiRequest<string>(
      "v2",
      input.apiPath,
      "PATCH",
      undefined,
      {
        Passcode: input.passcode,
      },
      {
        ["x-correlation-id"]: input.correlationId,
        ["x-device-name"]: await DeviceInfo.getDeviceName(),
      }
    );
  });
}
