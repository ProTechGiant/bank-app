import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { TickCircleIcon } from "@/assets/icons";
import DismissibleBanner from "@/components/DismissibleBanner";
import Page from "@/components/Page";
import MainStackParams from "@/navigation/MainStackParams";
import useNavigation from "@/navigation/use-navigation";

import { useSavingsPot } from "../../query-hooks";
import FundingStep, { FundingType } from "./FundingStep";
import PickOptionStep from "./PickOptionStep";

type StepType = "pick-funding-method" | FundingType;

export default function FundGoalModal() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParams, "SavingsGoals.FundGoalModal">>();
  const { t } = useTranslation();

  const { data } = useSavingsPot(route.params.SavingsPotId);
  const [isCreatedGoalBannerVisible, setIsCreatedGoalBannerVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepType>("pick-funding-method");

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

  const handleOnComplete = () => {
    navigation.goBack();

    if (route.params.isFirstFunding) {
      navigation.navigate("SavingsGoals.ListGoalsScreen");
    }
  };

  return (
    <>
      <DismissibleBanner
        visible={isCreatedGoalBannerVisible}
        message={t("SavingsGoals.FundGoalModal.goalCreatedBanner")}
        icon={<TickCircleIcon />}
      />
      <SafeAreaProvider>
        <Page keyboardVerticalOffset={Page.modalKeyboardVerticalOffset} isPadded={true}>
          {currentStep === "pick-funding-method" ? (
            <PickOptionStep
              onCancelPress={handleOnComplete}
              onOneTimePaymentPress={() => setCurrentStep("one-time-payment")}
              onRecommendedPaymentPress={() => setCurrentStep("recommended-payment")}
              onRecurringDepositPress={() => setCurrentStep("recurring-deposit")}
              recommendedAmount={data?.RecommendedAmount}
            />
          ) : (
            <FundingStep
              // reset component state after the `onContinueWith<xxxx>` are called
              key={currentStep}
              data={data}
              fundingType={currentStep}
              onBackPress={() => setCurrentStep("pick-funding-method")}
              onClosePress={handleOnClose}
              onCompletePress={handleOnComplete}
              onContinueWithOneTimePaymentPress={() => setCurrentStep("one-time-payment")}
              onContinueWithRecurringDepositPress={() => setCurrentStep("recurring-deposit")}
            />
          )}
        </Page>
      </SafeAreaProvider>
    </>
  );
}
