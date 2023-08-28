import { useMutation } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import { ChatEndResponse } from "../types";

export function useEndLiveChat() {
  return useMutation(() => {
    return api<ChatEndResponse>("v1", `genesys/chat/disconnect`, "POST", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

export function useSubmitCustomerFeedback() {
  const { userId } = useAuthContext();

  return useMutation(async (values: number) =>
    api(
      "v1",
      `genesys/feedback/${userId}`,
      "POST",
      undefined,
      {
        Feedback: values,
      },
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    )
  );
}
