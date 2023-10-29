import { TermsAndConditionsPage } from "@/components";
import { useContentTermsAndCondition } from "@/hooks/use-content";

export default function TermsAndConditionsScreen() {
  const termsAndConditionData = useContentTermsAndCondition();

  return <TermsAndConditionsPage termsData={termsAndConditionData.data} />;
}
