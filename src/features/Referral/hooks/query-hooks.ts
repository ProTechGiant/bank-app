import { useQuery } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

const queryKeys = {
  all: () => ["referrals"],
  customersReferrals: () => [...queryKeys.all(), "customersReferrals"],
};

interface CustomersReferralsType {
  MoneyEarned: string;
  NumberOfCompletedReferrals: string;
  ReferralCode: string;
}

export function useCustomersReferrals() {
  const { userId } = useAuthContext();
  const correlationId = generateRandomId();

  return useQuery(queryKeys.customersReferrals(), () => {
    return api<CustomersReferralsType>("v1", `customers/${userId}/referrals`, "GET", undefined, undefined, {
      ["x-Correlation-Id"]: correlationId,
    });
  });
}
