import { useMutation } from "react-query";

import sendApiRequest from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

export enum logoutActionsIds {
  SIGNOUT_ONLY = 1,
  SIGNOUT_DEREGISTER_DEVICE = 2,
}

export interface LogoutData {
  ActionId: number;
  token: string;
  logoutUsingAccount?: boolean;
}

export function useLogout() {
  const auth = useAuthContext();
  return useMutation(
    (body: LogoutData) => {
      return sendApiRequest<boolean>(
        "v2",
        "customers/sign-out",
        "PATCH",
        undefined,
        { ActionId: body.ActionId },
        {
          ["x-correlation-id"]: generateRandomId(),
          ["Authorization"]: `Bearer ${body.token}`,
        }
      );
    },
    {
      onSuccess(data, variables) {
        if (variables)
          auth.logout(variables.ActionId === logoutActionsIds.SIGNOUT_ONLY, !!variables?.logoutUsingAccount);
      },
    }
  );
}
