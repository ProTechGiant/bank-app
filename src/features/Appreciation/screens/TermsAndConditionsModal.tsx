import { TermsAndConditionsPage } from "@/components";
import { useContentTermsAndCondition } from "@/hooks/use-content";

export default function TermsAndConditionsModal() {
  //TODO this is not the correct hook call the correct one once it is implemented
  const { data, isLoading, refetch } = useContentTermsAndCondition();

  return <TermsAndConditionsPage termsData={data} isLoading={isLoading} refetch={refetch} />;
}
