import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import { AwaitTimeData, ChatEndResponse, ChatResponse, ReasonCode, ReasonsOptionData } from "../types";

export const queryKeys = {
  all: () => ["reasonOptions"] as const,
};

export function useEndLiveChat() {
  return useMutation(() => {
    return api<ChatEndResponse>("v1", `genesys/chat/disconnect`, "POST", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

export function useGetReasonsOptions() {
  const { i18n } = useTranslation();

  return useQuery(queryKeys.all(), () => {
    return api<ReasonsOptionData>("v1", "genesys/inbound/options", "GET", undefined, undefined, {
      ["Accept-Language"]: i18n.language,
    });
  });
}

export function useStartChat() {
  const { userId } = useAuthContext();

  return useMutation(async (values: ReasonCode) => {
    return api<ChatResponse>("v1", "genesys/chat", "POST", undefined, values, {
      ["x-correlation-id"]: generateRandomId(),
      ["UserId"]: `${userId}`,
    });
  });
}

export function useGetAwaitTimer() {
  return useMutation(() => {
    return api<AwaitTimeData>("v1", "genesys/chat/waiting-time", "GET", undefined, undefined, {
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

export function useChatRefresh() {
  const { i18n } = useTranslation();

  return useMutation(async (nextPosition: number) => {
    return api<ChatResponse>(
      "v1",
      `genesys/chat/refresh`,
      "POST",
      undefined,
      {
        TranscriptPosition: nextPosition,
      },
      {
        ["x-correlation-id"]: generateRandomId(),
        ["Accept-Language"]: i18n.language.toLocaleLowerCase(),
      }
    );
  });
}

export function useChatHistory() {
  const { i18n } = useTranslation();

  return useMutation(async (limit: number) => {
    return api<ChatResponse[]>("v1", `genesys/chat?limit=${limit}`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language.toLocaleLowerCase(),
      ["Content-Type"]: "application/json",
    });
  });
}
