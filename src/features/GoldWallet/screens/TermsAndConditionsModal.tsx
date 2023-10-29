import { TermsAndConditionsPage } from "@/components";

import { useTermsAndConditions } from "../hooks/query-hooks";

export default function TermsAndConditionsModal() {
  const termsAndConditionData = useTermsAndConditions();

  return <TermsAndConditionsPage termsData={termsAndConditionData.data} />;
}
