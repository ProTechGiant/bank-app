import { TermsAndConditionsPage } from "@/components";

import { useTermsAndConditions } from "../hooks/query-hooks";

export default function TermsAndConditionsModal() {
  const termsAndConditionData = useTermsAndConditions();
  const termsSections = termsAndConditionData?.data?.TermsSections;

  return <TermsAndConditionsPage termsSections={termsSections} />;
}
