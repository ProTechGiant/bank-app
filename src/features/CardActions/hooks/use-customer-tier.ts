import { useQuery } from "react-query";

import api from "@/api";

import { CustomerTier } from "../types/customerTier";

export default function useCustomerTier() {
  return useQuery("customer", () => {
    return api<CustomerTier>("v1", "customer/tier", "GET");
  });
}
