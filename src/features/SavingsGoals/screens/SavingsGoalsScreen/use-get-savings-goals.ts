import { useQuery } from "react-query";

import api from "@/api";

import { SavingsGoals } from "../../types";

export default function useGetSavingsGoals() {
  const userId = "100116";
  const correlationId = "12345";

  const { data, error } = useQuery<SavingsGoals>("savingsGoals", () => {
    return api<SavingsGoals>("api-dev", "v1", "customers/savings-pot/all", "GET", undefined, undefined, {
      ["UserId"]: userId,
      ["x-correlation-id"]: correlationId,
    });
  });

  return { data, error };
}
