import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Page from "@/components/Page";
import { useToasts } from "@/contexts/ToastsContext";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";

import { FundingStep, PickOptionStep } from "../components";
import { useSavingsPot } from "../hooks/query-hooks";
import { mockMissingSavingsPotDetails } from "../mocks/mockMissingSavingsPotDetails";
import { FundingType } from "../types";

type StepType = "pick-funding-method" | FundingType;

export default function FundGoalModal() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "SavingsGoals.FundGoalModal">>();
  const { t } = useTranslation();

  const { data } = useSavingsPot(route.params.PotId);
  const addToast = useToasts();

  const [currentStep, setCurrentStep] = useState<StepType>(
    route.params.step ? route.params.step : "pick-funding-method"
  );

  useEffect(() => {
    if (!route.params.isFirstFunding) return;
    addToast({ variant: "confirm", message: t("SavingsGoals.FundGoalModal.goalCreatedBanner") });
  }, [route.params.isFirstFunding, t, addToast]);

  const handleOnClose = () => {
    navigation.goBack();
  };

  const handleOnBackPress = () => {
    if (route.params.step) {
      navigation.goBack();
      return;
    }

    setCurrentStep("pick-funding-method");
  };

  const handleOnComplete = () => {
    navigation.goBack();

    if (route.params.isFirstFunding) {
      navigation.navigate("SavingsGoals.SavingsGoalsScreen");
    }
  };

  // TODO: recommendedAmount no longer exists in the new response
  // TODO: once provided, please update accordingly.

  return (
    <SafeAreaProvider>
      <Page>
        {currentStep === "pick-funding-method" ? (
          <PickOptionStep
            onCancelPress={handleOnComplete}
            onOneOffPaymentPress={() => setCurrentStep("one-off-payment")}
            onRecommendedPaymentPress={() => setCurrentStep("recommended-payment")}
            onRecurringPaymentsPress={() => setCurrentStep("recurring-payments")}
            recommendedAmount={mockMissingSavingsPotDetails.RecommendedAmount}
          />
        ) : (
          <FundingStep
            // reset component state after the `onContinueWith<xxxx>` are called
            key={currentStep}
            data={data}
            fundingType={currentStep}
            onBackPress={handleOnBackPress}
            onClosePress={handleOnClose}
            onCompletePress={handleOnComplete}
            onContinueWithOneTimePaymentPress={() => setCurrentStep("one-off-payment")}
            onContinueWithRecurringPaymentsPress={() => setCurrentStep("recurring-payments")}
          />
        )}
      </Page>
    </SafeAreaProvider>
  );
}
