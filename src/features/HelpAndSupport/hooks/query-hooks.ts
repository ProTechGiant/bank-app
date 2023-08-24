import { useMutation } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";

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
