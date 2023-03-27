import { useMutation } from "react-query";

import sendApiRequest from "@/api";

interface TokenizedCardResponseType {
  TimeStamp: string;
  cardId: string;
  secretKey: string;
}

export default function useTokenizedCard() {
  return useMutation((cardId: string) => {
    const path = `payments/tokenized/${cardId}`;
    return sendApiRequest<TokenizedCardResponseType>("v1", path, "GET", undefined, undefined, undefined);
  });
}
