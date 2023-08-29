import { useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

export function useGetCustomerOnboardingDate() {
  //  For this api user-id will be this: 0000001904
  return useQuery(["CustomerOnboardingDate"], () => {
    return api<{ OnboardingDate: string }>("v1", "statements/customers-onboarding-date", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}
