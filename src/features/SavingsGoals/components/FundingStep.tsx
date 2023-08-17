import { yupResolver } from "@hookform/resolvers/yup";
import { format, isThisMonth, parse } from "date-fns";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import * as yup from "yup";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import DayPickerInput from "@/components/Form/DayPickerInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import { useCurrentAccount, useSavingsAccount } from "@/hooks/use-accounts";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { PAYMENT_FREQUENCY } from "../constants";
import { isNextMonth, setDateAndFormatRecurringPayment } from "../helpers";
import { useFundSavingsPot } from "../hooks/query-hooks";
import { mockMissingSavingsPotDetails } from "../mocks/mockMissingSavingsPotDetails";
import { FundingType, SavingsPotDetailsResponse } from "../types";
import AccountDestination from "./AccountDestination";
import LargeCurrencyInput from "./LargeCurrencyInput";

interface FundingInput {
  PaymentAmount: number;
  DayOfMonth: number;
}

interface FundingStepProps {
  data: SavingsPotDetailsResponse | undefined;
  fundingType: FundingType;
  onBackPress: () => void;
  onClosePress: () => void;
  onCompletePress: () => void;
  onContinueWithOneTimePaymentPress: () => void;
  onContinueWithRecurringPaymentsPress: () => void;
}

export default function FundingStep({
  data,
  fundingType,
  onBackPress,
  onClosePress,
  onCompletePress,
  onContinueWithOneTimePaymentPress,
  onContinueWithRecurringPaymentsPress,
}: FundingStepProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const fundSavingPot = useFundSavingsPot();
  const account = useCurrentAccount();
  const savingsAccount = useSavingsAccount();
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

  const today = useMemo(() => new Date(), []);

  const targetDate = useMemo(
    () => (data?.TargetDate ? parse(data?.TargetDate, "yyyy-MM-dd", today) : undefined),
    [data?.TargetDate, today]
  );
  const accountBalance = account.data?.balance || 0;

  // below details no longer exist on the new response
  // TODO: once these are provided, please update accordingly
  //  RecommendedAmount
  //  HadRecurringFund
  //  HadOneTimeFund

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      PaymentAmount: yup
        .number()
        .required()
        .min(0.01, "") // do not accept 0 and hide error message
        .when("DayOfMonth", {
          // when recurring payment is today OR its a one-time payment, the user must have sufficient balance
          is: (value: number) => value === today.getDate() || fundingType === "one-off-payment",
          then: yup.number().max(accountBalance, t("SavingsGoals.FundGoalModal.FundingStep.amountExceedsBalance")),
        }),
      DayOfMonth: yup.number().when({
        is: fundingType !== "one-off-payment",
        then: yup.number().required(),
      }),
    });
  }, [accountBalance, fundingType, t, today]);

  const { control, handleSubmit, watch } = useForm<FundingInput>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      PaymentAmount:
        undefined !== data && fundingType === "recommended-payment"
          ? mockMissingSavingsPotDetails.RecommendedAmount
          : 0,
      DayOfMonth: fundingType !== "one-off-payment" ? new Date().getDate() : undefined,
    },
  });

  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [confirmationNextPaymentDate, setConfirmationNextPaymentDate] = useState<string | undefined>();
  const depositAmount = watch("PaymentAmount");

  const shouldShowConfirmationWithActionButtons =
    fundingType === "one-off-payment"
      ? mockMissingSavingsPotDetails.HadRecurringFund === false
      : mockMissingSavingsPotDetails.HadOneTimeFund === false;

  const handleOnSubmit = async (values: FundingInput) => {
    if (data === undefined || account.data === undefined || savingsAccount.data === undefined) return Promise.resolve();
    Keyboard.dismiss();

    // normally using async executors isn't a necessary. but in this case it is, because the Alert
    // allows to retry the submitting and we want to "remember" the loading state of the form
    // so it needs to pass through the submit process

    try {
      const response = await fundSavingPot.mutateAsync({
        ...values,
        Currency: "SAR",
        DebtorAccount: account.data.id,
        PotId: data.PotId,
        ...(fundingType === "recurring-payments"
          ? {
              StartingDate: setDateAndFormatRecurringPayment(values.DayOfMonth, "yyyy-MM-"),
              CreditorAccount: savingsAccount.data.id,
              PaymentFrequency: `${setDateAndFormatRecurringPayment(values.DayOfMonth)} ${PAYMENT_FREQUENCY}`,
            }
          : {}),
      });

      setConfirmationNextPaymentDate(response.NextPaymentDate);
      setIsConfirmationVisible(true);
    } catch (error) {
      setIsErrorModalVisible(true);

      warn("savings-pots", "Could not fund savings pot ", JSON.stringify(error));
    }
  };

  const handleOnContinuePress = () => {
    if (fundingType === "one-off-payment") return onContinueWithRecurringPaymentsPress();
    return onContinueWithOneTimePaymentPress();
  };

  const buttonSpaceStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
  }));

  const i18nKey = fundingType === "one-off-payment" ? "oneOffPayment" : "regularPayments";

  return (
    <>
      <NavHeader
        onBackPress={onBackPress}
        withBackButton
        title={t(`SavingsGoals.FundGoalModal.FundingStep.${i18nKey}.title`)}
        end={<NavHeader.CloseEndButton onPress={onClosePress} />}
      />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <ContentContainer style={styles.content}>
          <LargeCurrencyInput
            autoFocus
            control={control}
            helperText={currentValue => {
              if (undefined !== data && currentValue > accountBalance) {
                return t("SavingsGoals.FundGoalModal.FundingStep.amountExceedsBalance");
              }
            }}
            maxLength={10}
            name="PaymentAmount"
          />
          <Stack align="stretch" direction="vertical" gap="16p">
            {fundingType !== "one-off-payment" && (
              <DayPickerInput
                buttonText={t("SavingsGoals.FundGoalModal.FundingStep.dayPickerButton")}
                control={control}
                headerText={t("SavingsGoals.FundGoalModal.FundingStep.dayPickerHeader")}
                helperText={currentValue => {
                  if (undefined !== targetDate) {
                    if (
                      // payment will be scheduled after target date
                      (isThisMonth(targetDate) &&
                        (currentValue > targetDate.getDate() || currentValue < today.getDate())) ||
                      // next month but will scheduled after target date
                      (isNextMonth(targetDate, today) &&
                        currentValue > targetDate.getDate() &&
                        currentValue < today.getDate())
                    ) {
                      return t("SavingsGoals.FundGoalModal.FundingStep.helperIfDayIsAfterTarget");
                    }
                  }

                  if (currentValue > 28) return t("SavingsGoals.FundGoalModal.FundingStep.helperIfDayExceeds28");
                }}
                label={t("SavingsGoals.FundGoalModal.FundingStep.monthly")}
                name="DayOfMonth"
                placeholder={t("SavingsGoals.FundGoalModal.FundingStep.dayPickerPlaceholder")}
              />
            )}
            {undefined !== data && (
              <AccountDestination
                destination={t("SavingsGoals.Account.from")}
                accountName={t("SavingsGoals.Account.mainAccount")}
                balance={accountBalance}
              />
            )}
            <View style={buttonSpaceStyle}>
              <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
                {t("SavingsGoals.FundGoalModal.FundingStep.continueButton")}
              </SubmitButton>
            </View>
          </Stack>
        </ContentContainer>
      </ScrollView>
      <NotificationModal
        buttons={
          shouldShowConfirmationWithActionButtons && {
            primary: (
              <Button onPress={handleOnContinuePress}>
                {t(`SavingsGoals.FundGoalModal.FundingStep.${i18nKey}.continueButton`)}
              </Button>
            ),
            secondary: (
              <Button onPress={onCompletePress}>
                {t(`SavingsGoals.FundGoalModal.FundingStep.${i18nKey}.skipButton`)}
              </Button>
            ),
          }
        }
        onClose={shouldShowConfirmationWithActionButtons ? undefined : onCompletePress}
        title={t(`SavingsGoals.FundGoalModal.FundingStep.${i18nKey}.modalTitle`)}
        message={t(`SavingsGoals.FundGoalModal.FundingStep.${i18nKey}.modalText`, {
          amount: depositAmount.toLocaleString("en-US", { style: "decimal" }),
          firstPaymentDate:
            undefined !== confirmationNextPaymentDate
              ? format(parse(confirmationNextPaymentDate, "yyyy-MM-dd", new Date()), "d MMM yyyy")
              : "-",
        })}
        isVisible={isConfirmationVisible}
        variant="success"
      />
      <NotificationModal
        buttons={{
          primary: (
            <Button loading={fundSavingPot.isLoading} onPress={handleSubmit(handleOnSubmit)}>
              {t("SavingsGoals.FundGoalModal.FundingStep.errorTryAgain")}
            </Button>
          ),
          secondary: (
            <Button onPress={() => navigation.goBack()}>
              {t("SavingsGoals.FundGoalModal.FundingStep.errorNotNow")}
            </Button>
          ),
        }}
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        variant="error"
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  scroll: {
    flex: 1,
  },
});
