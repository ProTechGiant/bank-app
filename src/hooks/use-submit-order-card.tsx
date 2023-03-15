import { useMutation } from "react-query";

import api from "@/api";
import { OrderCardFormValues } from "@/types/Address";

interface OrderCardResponse {
  response: string;
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
}

export default function useSubmitOrderCard() {
  return useMutation(({ values, correlationId }: { values: OrderCardFormValues; correlationId: string }) => {
    return api<OrderCardResponse>("v1", "cards", "POST", undefined, values, {
      ["x-correlation-id"]: correlationId,
    });
  });
}
