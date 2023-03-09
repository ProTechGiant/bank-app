import { useQuery } from "react-query";

import api from "@/api";

import { CustomerTier } from "../types/CustomerTier";

export default function useCustomerTier() {
  // @todo remove when this is ready now we will use the mocked
  // http://alpha-tier-mock-framework.apps.development.projectcroatia.cloud/v1/customer/tier=8d5c47e1-cb85-46f0-87f3-e28e8366c499
  const tierId = "8d5c47e1-cb85-46f0-87f3-e28e8366c499";

  return useQuery("customer", () => {
    return api<CustomerTier>("v1", `customer/tier=${tierId}`, "GET", undefined, undefined);
  });
}
