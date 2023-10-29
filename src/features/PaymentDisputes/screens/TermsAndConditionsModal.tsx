import { TermsAndConditionsPage } from "@/components";
import { useContentTermsAndCondition } from "@/hooks/use-content";

export default function TermsAndConditionsModal() {
  //TODO: change ContentCategoryId when ready from BE
  const termsAndConditionData = useContentTermsAndCondition("TermsAndConditions");

  return <TermsAndConditionsPage termsData={termsAndConditionData.data} />;
}
