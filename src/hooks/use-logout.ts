import { useMutation } from "react-query";

import sendApiRequest from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

export enum logoutActionsIds {
  MANUALLY_ID = 1,
  AUTOMATIC_ID = 2,
}

export default function useLogout() {
  const auth = useAuthContext();
  const logoutAsync = useMutation(async (ActionId: number) => {
    //TODO: will remove when API is ready
    const testMode = true;
    if (testMode) {
      return {
        status: 200,
      };
    } else {
      return sendApiRequest<boolean>(
        "v1",
        "customers/sign-out",
        "PATCH",
        undefined,
        { ActionId: ActionId },
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      );
    }
  });

  return async function (actionId: number) {
    await logoutAsync.mutateAsync(actionId);
    auth.logout(actionId === logoutActionsIds.AUTOMATIC_ID);
  };
}
