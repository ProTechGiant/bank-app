import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

interface SendMessage {
  Message: string;
  TranscriptPositionIncluding: string;
}

export function useSendMessage() {
  const { i18n } = useTranslation();

  return useMutation(async (values: SendMessage) => {
    return api("v1", "/genesys/chat/send", "POST", undefined, values, {
      ["Accept-Language"]: i18n.language,
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}
