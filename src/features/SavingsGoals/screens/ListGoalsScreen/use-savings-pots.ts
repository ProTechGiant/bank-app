import { useQuery } from "react-query";

import api from "@/api";
import { useTemporaryContext } from "@/contexts/TemporaryContext";

import { SavingsPot } from "../../types";

interface SavingsPotsResponse {
  SavingsPots: SavingsPot[];
}

export default function useSavingsPots() {
  /* Temporary UserId for testing the instructions screen */
  const { temporaryUserId } = useTemporaryContext();
  const userId = temporaryUserId;

  return useQuery(["savings-goals"], () => {
    return api<SavingsPotsResponse>("api-dev", "v1", "customers/savings-pot/all", "GET", undefined, undefined, {
      ["UserId"]: userId,
      ["x-correlation-id"]: "12345",
    });
  });
}
