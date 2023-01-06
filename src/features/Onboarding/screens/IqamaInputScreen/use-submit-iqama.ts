import { useMutation } from "react-query";

import api from "@/api";

import IqamaInputs from "./IqamaInputs";

interface IqamaResponse {
  CustomerId: string;
  CustomerType: string;
  NationalId: string;
  MobileNumber: string;
}

interface IqamaError {
  Code: string;
  Message: string;
  Errors: Array<{ Message: string; Path: string }>;
  TraceId: string;
}

export default function useSubmitIqama() {
  return useMutation((values: IqamaInputs) => {
    return api<IqamaResponse, IqamaError>(
      "api-dev",
      "v1",
      "customers/checks",
      "POST",
      undefined,
      {
        NationalId: values.NationalId,
        MobileNumber: values.MobileNumber,
      },
      {
        ["X-Workflow-Task-Id"]: "325252",
        ["UserId"]: "12bdef0e-9ffd-440f-b265-644d87b32fbd",
        ["X-API-KEY"]: "564c0148-56a1-11ed-9b6a-0242ac120002",
      }
    );
  });
}
