import { useMutation } from "react-query";

import api from "@/api";
import { useTemporaryContext } from "@/contexts/TemporaryContext";

interface GetSavingsGoalNumResponse {
  SavingsPotsNumber: number;
}

interface GetSavingsGoalNumError {
  Code: string;
  Message: string;
  Errors: Array<{ Message: string; Path: string }>;
  TraceId: string;
}

export default function useGetSavingsGoalNumber() {
  /* Temporary UserId for testing the instructions screen */
  const { temporaryUserId } = useTemporaryContext();
  const userId = temporaryUserId;
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
