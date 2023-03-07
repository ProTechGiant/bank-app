import { useQuery } from "react-query";

import api from "@/api";

import { Address } from "../../../context/OrderCardContext";

export default function useGetPrimaryAddress() {
  return useQuery("cards", () => {
    return api<Address>("v1", "cards/customer/address", "GET", undefined, undefined);
  });
}
