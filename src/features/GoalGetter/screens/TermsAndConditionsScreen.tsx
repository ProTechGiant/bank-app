import { RouteProp, useRoute } from "@react-navigation/native";

import { TermsAndConditionsPage } from "@/components";

import { GoalGetterStackParams } from "../GoalGetterStack";
import { useGetTermsAndConditions } from "../hooks/query-hooks";

export default function TermsAndConditionsScreen() {
  const { params } = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.TermsAndConditionsScreen">>();
  const termsAndConditions = useGetTermsAndConditions(params.productId);
  return <TermsAndConditionsPage termsData={termsAndConditions.data?.TermsAndConditions} />;
}
