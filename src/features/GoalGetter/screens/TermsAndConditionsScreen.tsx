import { RouteProp, useRoute } from "@react-navigation/native";

import { TermsAndConditionsPage } from "@/components";

import { GoalGetterStackParams } from "../GoalGetterStack";
import { useGetTermsAndConditions } from "../hooks/query-hooks";

export default function TermsAndConditionsScreen() {
  const { params } = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.TermsAndConditionsScreen">>();
  const { data: termsAndConditions, isLoading, refetch } = useGetTermsAndConditions(params.productId);
  return (
    <TermsAndConditionsPage
      refetch={refetch}
      termsData={termsAndConditions?.TermsAndConditions}
      isLoading={isLoading}
    />
  );
}
