import { useMutation } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import { ChatEndParams, ChatEndResponse } from "../types";

export function useEndLiveChat() {
  const { userId } = useAuthContext();

  return useMutation(({ serviceName, chatId, secureKey, alias }: ChatEndParams) => {
    return api<ChatEndResponse>(
      "v1",
      `internal/v1/genesys/chat/${serviceName}/${chatId}/disconnect`,
      "POST",
      undefined,
      {
        secureKey,
        alias,
        userId,
      }
    );
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
