import { TermsAndConditionsPage } from "@/components";
import { useContentTermsAndCondition } from "@/hooks/use-content";

export default function TermsAndConditionsScreen() {
  const { data, isLoading, refetch } = useContentTermsAndCondition("AllInOneCardTermsAndConditions");

  return <TermsAndConditionsPage termsData={data} isLoading={isLoading} refetch={refetch} />;
}
