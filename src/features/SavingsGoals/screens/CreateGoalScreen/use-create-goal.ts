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
  const { temporaryUserId } = useTemporaryContext();

  return useMutation((values: CreateGoalInput) => {
    return api<CreateGoalResponse, CreateGoalError>(
      "api-dev",
      "v1",
      "customers/savings-pot",
      "POST",
      undefined,
      { ...values, targetDate: format(values.TargetDate, "yyyy-MM-d") },
      {
        ["UserId"]: temporaryUserId,
        ["x-correlation-id"]: "1234567",
      }
    );
  });
}
