import { TermsAndConditionsPage } from "@/components";
import { useContentTermsAndCondition } from "@/hooks/use-content";

export default function TermsAndConditionsModal() {
  //TODO: change ContentCategoryId when ready from BE
  const { data, isLoading, refetch } = useContentTermsAndCondition("TermsAndConditions");

  return <TermsAndConditionsPage termsData={data} isLoading={isLoading} refetch={refetch} />;
}
