import { TermsAndConditionsPage } from "@/components";
import { useContentTermsAndCondition } from "@/hooks/use-content";

export default function TermsAndConditionsScreen() {
  const termsAndConditionData = useContentTermsAndCondition("AllInOneCardTermsAndConditions");
  const termsSections = termsAndConditionData?.data?.TermsSections;

  return <TermsAndConditionsPage termsSections={termsSections} />;
}
