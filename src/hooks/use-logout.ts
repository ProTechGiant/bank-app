import { useMutation } from "react-query";

import sendApiRequest from "@/api";
import { generateRandomId } from "@/utils";

export default function useLogout() {
  return useMutation(async () => {
    return sendApiRequest<boolean>("v1", "customers/logout", "DELETE", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}
