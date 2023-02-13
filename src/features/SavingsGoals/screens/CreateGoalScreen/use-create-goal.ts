import { format } from "date-fns";
import { useMutation } from "react-query";

import api from "@/api";
import { useTemporaryContext } from "@/contexts/TemporaryContext";

import { CreateGoalInput } from "../../types";

interface CreateGoalResponse {
  SavingsPotId: string;
}

interface CreateGoalError {
  Code: string;
  Message: string;
  Errors: Array<{ Message: string; Path: string }>;
  TraceId: string;
}

export default function useCreateGoal() {
  /* Temporary UserId for testing the instructions screen */
  const { temporaryUserId } = useTemporaryContext();
  const userId = temporaryUserId;

  const correlationId = "1234567";

  return useMutation((values: CreateGoalInput) => {
    if (!userId || !correlationId) {
      throw new Error("Need valid `userId` and `correlationId` to be available");
    }

    return api<CreateGoalResponse, CreateGoalError>(
      "api-dev",
      "v1",
      "customers/savings-pot",
      "POST",
      undefined,
      { ...values, targetDate: format(values.TargetDate, "yyyy-MM-d") },
      {
        ["UserId"]: userId,
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}
