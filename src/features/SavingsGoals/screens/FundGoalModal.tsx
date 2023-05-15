import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { TickCircleIcon } from "@/assets/icons";
import DismissibleBanner from "@/components/DismissibleBanner";
import Page from "@/components/Page";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";

import { FundingStep, PickOptionStep } from "../components";
import { useSavingsPot } from "../hooks/query-hooks";
import { mockMissingSavingsPotDetails } from "../mocks/mockMissingSavingsPotDetails";
import { FundingType } from "../types";

type StepType = "pick-funding-method" | FundingType;

export default function FundGoalModal() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParams, "SavingsGoals.FundGoalModal">>();
  const { t } = useTranslation();

  const { data } = useSavingsPot(route.params.PotId);
  const [isCreatedGoalBannerVisible, setIsCreatedGoalBannerVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepType>(
    route.params.step ? route.params.step : "pick-funding-method"
  );

  useEffect(() => {
    if (!route.params.isFirstFunding || isCreatedGoalBannerVisible) return;

    const timeout = setTimeout(() => {
      setIsCreatedGoalBannerVisible(true);
      setTimeout(() => setIsCreatedGoalBannerVisible(false), 3000);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

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
    <>
      <DismissibleBanner
        visible={isCreatedGoalBannerVisible}
        message={t("SavingsGoals.FundGoalModal.goalCreatedBanner")}
        icon={<TickCircleIcon />}
      />
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
    </>
  );
}
