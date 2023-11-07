import { TermsAndConditionsPage } from "@/components";

import { useTermsAndConditions } from "../hooks/query-hooks";

export default function TermsAndConditionsModal() {
  const { data, isLoading, refetch } = useTermsAndConditions();

  return <TermsAndConditionsPage termsData={data} isLoading={isLoading} refetch={refetch} />;
}
