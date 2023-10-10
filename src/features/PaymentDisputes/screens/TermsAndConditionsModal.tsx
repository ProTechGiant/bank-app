import { TermsAndConditionsPage } from "@/components";
import { useContentTermsAndCondition } from "@/hooks/use-content";

export default function TermsAndConditionsModal() {
  //TODO: change ContentCategoryId when ready from BE
  const termsAndConditionData = useContentTermsAndCondition("TermsAndConditions");
  const termsSections = termsAndConditionData?.data?.TermsSections;

  return <TermsAndConditionsPage termsSections={termsSections} />;
}
