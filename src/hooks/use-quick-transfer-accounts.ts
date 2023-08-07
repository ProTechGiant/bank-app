import { useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

interface QuickTransferAccountsResponse {
  CustomerTermsConditionsFlag: "0" | "1";
}

export default function useQuickTransferAccounts() {
  return useQuery(["QuickTransferActivation"], () => {
    return api<QuickTransferAccountsResponse>("v1", "transfers/accounts", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}
