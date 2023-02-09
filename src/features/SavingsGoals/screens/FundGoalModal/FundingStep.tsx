import { yupResolver } from "@hookform/resolvers/yup";
import { isThisMonth, parse } from "date-fns";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import * as yup from "yup";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import DayPickerInput from "@/components/Form/DayPickerInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";

import FromAccount from "../../components/FromAccount";
import LargeCurrencyInput from "../../components/LargeCurrencyInput";
import useFundSavingsPot from "./use-fund-savings-pot";
import { SavingsPotDetailsResponse } from "./use-savings-pot";

export type FundingType = "recurring-deposit" | "one-time-payment" | "recommended-payment";

interface FundingInput {
  amount: number;
  dayOfMonth: number;
}

interface FundingStepProps {
  data: SavingsPotDetailsResponse | undefined;
  fundingType: FundingType;
  onBackPress: () => void;
  onContinueWithOneTimePaymentPress: () => void;
  onContinueWithRecurringDepositPress: () => void;
}

export default function FundingStep({
  data,
  fundingType,
  onBackPress,
  onContinueWithOneTimePaymentPress,
  onContinueWithRecurringDepositPress,
}: FundingStepProps) {
  const navigation = useNavigation();
  const { i18n, t } = useTranslation();
  const fundSavingPot = useFundSavingsPot();

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        amount: yup
          .number()
          .required()
          .max(data?.MainAccountAmount ?? 0, t("SavingsGoals.FundGoalModal.FundingStep.amountExceedsBalance"))
          .min(0),
        dayOfMonth: yup.number().when({
          is: fundingType !== "one-time-payment",
          then: yup.number().required(),
        }),
      }),
    [data, fundingType, i18n.language]
  );

  const { control, handleSubmit, watch } = useForm<FundingInput>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      amount: undefined !== data && fundingType === "recommended-payment" ? data.RecommendedAmount : 0,
      dayOfMonth: fundingType !== "one-time-payment" ? new Date().getDate() : undefined,
    },
  });

  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const depositAmount = watch("amount");
  const shouldShowConfirmationWithActionButtons = data?.GoalAmount === 0;

  const handleOnClose = () => {
    navigation.goBack();
  };

  const handleOnSubmit = async (values: FundingInput) => {
    await fundSavingPot.mutateAsync();
    setIsConfirmationVisible(true);
  };

  const handleOnContinuePress = () => {
    if (fundingType === "one-time-payment") return onContinueWithRecurringDepositPress();
    return onContinueWithOneTimePaymentPress();
  };

  const targetIsThisMonth = useMemo(
    () => (data?.TargetDate ? isThisMonth(parse(data?.TargetDate, "yyyy-MM-dd", new Date())) : false),
    [data?.TargetDate]
  );

  const i18nKey = fundingType === "one-time-payment" ? "oneTimeDeposit" : "recurringDeposit";

  return (
    <>
      <NavHeader
        onBackPress={onBackPress}
        withBackButton
        title={t(`SavingsGoals.FundGoalModal.FundingStep.${i18nKey}.title`)}
        end={<NavHeader.CloseEndButton onPress={handleOnClose} />}
      />
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <ContentContainer style={{ flex: 1, justifyContent: "space-between" }}>
          <Stack align="stretch" direction="vertical" gap="16p">
            <LargeCurrencyInput
              autoFocus
              control={control}
              maxLength={16} // 10 digits and 2 decimals
              name="amount"
            />
            {fundingType !== "one-time-payment" && (
              <DayPickerInput
                buttonText={t("SavingsGoals.FundGoalModal.FundingStep.dayPickerButton")}
                control={control}
                headerText={t("SavingsGoals.FundGoalModal.FundingStep.dayPickerHeader")}
                helperText={currentValue => {
                  if (targetIsThisMonth && currentValue >= new Date().getDate()) {
                    return t("SavingsGoals.FundGoalModal.FundingStep.helperIfDayIsAfterTarget");
                  }

                  if (currentValue > 28) return t("SavingsGoals.FundGoalModal.FundingStep.helperIfDayExceeds28");
                }}
                label={t("SavingsGoals.FundGoalModal.FundingStep.monthly")}
                name="dayOfMonth"
                placeholder={t("SavingsGoals.FundGoalModal.FundingStep.dayPickerPlaceholder")}
              />
            )}
            {undefined !== data && (
              <FromAccount name={t("SavingsGoals.fromAccount.mainAccount")} balance={data.MainAccountAmount} />
            )}
          </Stack>
          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            Continue
          </SubmitButton>
        </ContentContainer>
      </ScrollView>
      <NotificationModal
        onClose={handleOnClose}
        title={t(`SavingsGoals.FundGoalModal.FundingStep.${i18nKey}.modalTitle`)}
        message={t(`SavingsGoals.FundGoalModal.FundingStep.${i18nKey}.modalText`, {
          amount: depositAmount.toLocaleString("en-US", { style: "decimal" }),
          firstPaymentDate: "tomorrow", // TODO
        })}
        isVisible={isConfirmationVisible}
        primaryButton={
          shouldShowConfirmationWithActionButtons && (
            <Button onPress={handleOnContinuePress}>
              {t(`SavingsGoals.FundGoalModal.FundingStep.${i18nKey}.continueButton`)}
            </Button>
          )
        }
        secondaryButton={
          shouldShowConfirmationWithActionButtons && (
            <Button onPress={handleOnClose}>{t(`SavingsGoals.FundGoalModal.FundingStep.${i18nKey}.skipButton`)}</Button>
          )
        }
      />
    </>
  );
}
