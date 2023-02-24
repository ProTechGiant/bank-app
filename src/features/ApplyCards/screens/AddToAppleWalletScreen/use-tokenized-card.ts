import { useMutation } from "react-query";

import api from "@/api";

interface TokenizedCardResponseType {
  TimeStamp: string;
  cardId: string;
  secretKey: string;
}

export default function useTokenizedCard() {
  return useMutation((cardId: string) => {
    const path = `payments/tokenized/${cardId}`;
    return api<TokenizedCardResponseType>("v1", path, "GET", undefined, undefined, undefined);
  });
}
