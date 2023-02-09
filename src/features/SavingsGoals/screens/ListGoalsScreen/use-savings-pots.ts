import { useQuery } from "react-query";

import api from "@/api";

import { SavingsPot } from "../../types";

interface SavingsPotsResponse {
  SavingsPots: SavingsPot[];
}

export default function useSavingsPots() {
  return useQuery(["savings-goals"], () => {
    return api<SavingsPotsResponse>("api-dev", "v1", "customers/savings-pot/all", "GET", undefined, undefined, {
      ["UserId"]: "100116",
      ["x-correlation-id"]: "12345",
    });
  });
}
