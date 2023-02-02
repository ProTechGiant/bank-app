import { useMutation } from "react-query";

import api from "@/api";

import { Address } from "../../../context/OrderCardContext";

export default function useGetPrimaryAddress() {
  return useMutation(() => {
    return api<Address | undefined>("api-dev", "v1", "cards/customer/address", "GET", undefined, undefined);
  });
}
