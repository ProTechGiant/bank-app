import { useMutation } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

interface SavingsGoalNumResponse {
  SavingsPotsNumber: number;
}

export default function useSavingsGoalNumber() {
  return useMutation(() => {
    return api<SavingsGoalNumResponse>("v1", "customers/savings-pots/check-no", "GET", undefined, undefined, {
      ["x-Correlation-Id"]: generateRandomId(),
      UserId: "301", // replace with appropriate user id
    });
  });
}
