import { useMutation } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

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
    return api<OrderCardResponse, OrderCardError>("v1", "cards", "POST", undefined, values, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}
