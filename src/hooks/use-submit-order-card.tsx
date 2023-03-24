import { useMutation } from "react-query";

import api from "@/api";
import { OrderCardFormValues } from "@/types/Address";
import { generateRandomId } from "@/utils";

interface OrderCardResponse {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
}

export default function useSubmitOrderCard() {
  return useMutation(async ({ values }: { values: OrderCardFormValues }) => {
    const correlationId = generateRandomId();

    const response = await api<OrderCardResponse>("v1", "cards", "POST", undefined, values, {
      ["x-correlation-id"]: correlationId,
    });

    return { ...response, correlationId };
  });
}
