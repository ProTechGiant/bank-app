import { format } from "date-fns";
import { useMutation, useQuery } from "react-query";

import api from "@/api";

interface GetSavingsGoalNumResponse {
  SavingsPotsNumber: string;
}

interface GetSavingsGoalNumError {
  Code: string;
  Message: string;
  Errors: Array<{ Message: string; Path: string }>;
  TraceId: string;
}

export default function useGetSavingsGoalNumber() {
  const userId = "100116";
  const correlationId = "1234567";

  return useMutation(() => {
    return api<GetSavingsGoalNumResponse, GetSavingsGoalNumError>(
      "api-dev",
      "v1",
      "customers/savings-pot/check-no",
      "GET",
      undefined,
      undefined,
      {
        ["UserId"]: userId,
        ["x-Correlation-Id"]: correlationId,
      }
    );
  });
}
