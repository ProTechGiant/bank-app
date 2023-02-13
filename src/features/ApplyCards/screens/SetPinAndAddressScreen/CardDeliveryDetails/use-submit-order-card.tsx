import { useMutation } from "react-query";

import api from "@/api";

import { OrderCardFormValues } from "../../../context/OrderCardContext";

interface OrderCardResponse {
  response: string;
}

interface OrderCardError {
  Code: string;
  Message: string;
  Errors: Array<{ Message: string; Path: string }>;
  TraceId: string;
}

export default function useSubmitOrderCard() {
  return useMutation((values: OrderCardFormValues) => {
    return api<OrderCardResponse, OrderCardError>(
      "api-dev",
      "v1",
      "cards",
      "POST",
      undefined,
      {
        ...values,
      },
      {
        ["UserId"]: "100116",
        ["x-correlation-id"]: String(Math.floor(Math.random() * 1000000000)), // Temporary: random correlation ID to avoid 502 error
      }
    );
  });
}
