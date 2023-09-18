import { useMutation } from "react-query";

import sendApiRequest from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

export default function useLogout() {
  const auth = useAuthContext();
  const logoutAsync = useMutation(async (ActionId: number) => {
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
  });

  return async function (actionId: number) {
    await logoutAsync.mutateAsync(actionId);
    auth.logout();
  };
}
