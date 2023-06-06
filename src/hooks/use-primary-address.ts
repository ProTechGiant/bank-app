import { useQuery } from "react-query";

import api from "@/api";
import { Address } from "@/types/Address";
import { generateRandomId } from "@/utils";

export default function usePrimaryAddress() {
  return useQuery(["cards", "primary-address"], () => {
    return api<Address>("v1", "cards/customer/address", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}
