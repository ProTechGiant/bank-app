import { useMutation } from "react-query";

import api from "@/api";

interface GetSavingsGoalNumResponse {
  SavingsPotsNumber: number;
}

export default function useGetSavingsGoalNumber() {
  return useMutation(() => {
    return api<GetSavingsGoalNumResponse>("v1", "customers/savings-pots/check-no", "GET", undefined, undefined, {
      ["x-Correlation-Id"]: "1234567",
    });
  });
}
