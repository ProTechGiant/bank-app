import DeviceInfo from "react-native-device-info";
import { useMutation } from "react-query";

import sendApiRequest from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";
import { setItemInEncryptedStorage } from "@/utils/encrypted-storage";

import { useGetAuthenticationToken } from "./use-api-authentication-token";

export enum logoutActionsIds {
  MANUALLY_ID = 1,
  AUTOMATIC_ID = 2,
}

export default function useLogout() {
  const auth = useAuthContext();
  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken();

  const handleGetAuthenticationToken = async () => {
    const res = await getAuthenticationToken();
    if (typeof res?.AccessToken === "string") {
      setItemInEncryptedStorage("authToken", res.AccessToken);
      auth.setAuthToken(res.AccessToken);
    }
  };

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
      }
    );
  });

  return async function (actionId: number) {
    await logoutAsync.mutateAsync(actionId);
    auth.logout(actionId === logoutActionsIds.AUTOMATIC_ID);
    handleGetAuthenticationToken();
  };
}
