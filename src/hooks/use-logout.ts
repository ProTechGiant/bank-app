import DeviceInfo from "react-native-device-info";
import { useMutation } from "react-query";

import sendApiRequest from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

export enum logoutActionsIds {
  SIGNOUT_ONLY = 1,
  SIGNOUT_DEREGISTER_DEVICE = 2,
}

export default function useLogout() {
  const auth = useAuthContext();

  const logoutAsync = useMutation(async (ActionId: number) => {
    return sendApiRequest<boolean>(
      "v2",
      "customers/sign-out",
      "PATCH",
      undefined,
      { ActionId: ActionId },
      {
        ["x-correlation-id"]: generateRandomId(),
        ["x-device-name"]: await DeviceInfo.getDeviceName(),
        ["UserId"]: auth.userId ?? "",
      }
    );
  });

  return async function (actionId: number) {
    await logoutAsync.mutateAsync(actionId);
    auth.logout(actionId === logoutActionsIds.SIGNOUT_ONLY);
  };
}
