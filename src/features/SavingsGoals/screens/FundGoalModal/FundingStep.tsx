import { yupResolver } from "@hookform/resolvers/yup";
import { format, isThisMonth, parse, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, Keyboard, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import * as yup from "yup";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import DayPickerInput from "@/components/Form/DayPickerInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import AccountDestination from "../../components/AccountDestination";
import { mockMissingSavingsPotDetails } from "../../mocks/mockMissingSavingsPotDetails";
import { SavingsPotDetailsResponse, useFundSavingsPot } from "../../query-hooks";
import isNextMonth from "./is-next-month";
import LargeCurrencyInput from "./LargeCurrencyInput";

export type FundingType = "recurring-deposit" | "one-time-payment" | "recommended-payment";

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
  onContinueWithRecurringDepositPress: () => void;
}

export default function FundingStep({
  data,
  fundingType,
  onBackPress,
  onClosePress,
  onCompletePress,
  onContinueWithOneTimePaymentPress,
  onContinueWithRecurringDepositPress,
}: FundingStepProps) {
  const navigation = useNavigation();
  const { i18n, t } = useTranslation();
  const fundSavingPot = useFundSavingsPot();

  const today = new Date();
  const targetDate = useMemo(
    () => (data?.TargetDate ? parse(data?.TargetDate, "yyyy-MM-dd", today) : undefined),
    [data]
  );

  // below details no longer exist on the new response
  // TODO: once these are provided, please update accordingly
  //  MainAccountAmount
  //  RecommendedAmount
  //  HadRecurringFund
  //  HadOneTimeFund

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      PaymentAmount: yup
        .number()
        .required()
        .min(0.01)
        .when("DayOfMonth", {
          // when recurring payment is today OR its a one-time payment, the user must have sufficient balance
          is: (value: number) => value === today.getDate() || fundingType === "one-time-payment",
          then: yup
            .number()
            .max(
              mockMissingSavingsPotDetails.MainAccountAmount ?? 0,
              t("SavingsGoals.FundGoalModal.FundingStep.amountExceedsBalance")
            ),
        }),
      DayOfMonth: yup.number().when({
        is: fundingType !== "one-time-payment",
        then: yup.number().required(),
      }),
    });
  }, [data, fundingType, i18n.language]);

  const { control, handleSubmit, watch } = useForm<FundingInput>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      PaymentAmount:
        undefined !== data && fundingType === "recommended-payment"
          ? mockMissingSavingsPotDetails.RecommendedAmount
          : 0,
      DayOfMonth: fundingType !== "one-time-payment" ? new Date().getDate() : undefined,
    },
  });

  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [confirmationNextPaymentDate, setConfirmationNextPaymentDate] = useState<string | undefined>();
  const depositAmount = watch("PaymentAmount");

  const shouldShowConfirmationWithActionButtons =
    fundingType === "one-time-payment"
      ? mockMissingSavingsPotDetails.HadRecurringFund === false
      : mockMissingSavingsPotDetails.HadOneTimeFund === false;

  const handleOnSubmit = (values: FundingInput) => {
    if (undefined === data) return Promise.resolve();
    Keyboard.dismiss();

    // normally using async executors isnt a necessary. but in this case it is, because the Alert
    // allows to retry the submitting and we want to "remember" the loading state of the form
    // so it needs to pass through the submit process

    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async resolve => {
      try {
        const response = await fundSavingPot.mutateAsync({
          ...values,
          Currency: "SAR",
          DebitorAccount: data.RecurringPayments.CreditorAccount,
          PotId: data.PotId,
          StartingDate: parseISO(data.RecurringPayments.StartingDate),
        });

        setConfirmationNextPaymentDate(response.NextPaymentDate);
        setIsConfirmationVisible(true);

        resolve();
      } catch (error) {
        Alert.alert(t("errors.generic.title"), t("errors.generic.message"), [
          {
            text: t("SavingsGoals.FundGoalModal.FundingStep.errorNotNow"),
            onPress: () => {
              navigation.goBack();
              resolve();
            },
          },
          {
            text: t("SavingsGoals.FundGoalModal.FundingStep.errorTryAgain"),
            onPress: () => {
              handleOnSubmit(values)
                .then(() => resolve())
                .catch(() => resolve()); // just in case
            },
          },
        ]);
      }
    });
  };

  const handleOnContinuePress = () => {
    if (fundingType === "one-time-payment") return onContinueWithRecurringDepositPress();
    return onContinueWithOneTimePaymentPress();
  };

  const buttonSpaceStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
  }));

  const i18nKey = fundingType === "one-time-payment" ? "oneTimeDeposit" : "recurringDeposit";

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
              if (undefined !== data && currentValue > mockMissingSavingsPotDetails.MainAccountAmount) {
                return t("SavingsGoals.FundGoalModal.FundingStep.amountExceedsBalance");
              }
            }}
            maxLength={10}
            name="PaymentAmount"
          />
          <Stack align="stretch" direction="vertical" gap="16p">
            {fundingType !== "one-time-payment" && (
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
                balance={mockMissingSavingsPotDetails.MainAccountAmount}
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
        onClose={onCompletePress}
        title={t(`SavingsGoals.FundGoalModal.FundingStep.${i18nKey}.modalTitle`)}
        message={t(`SavingsGoals.FundGoalModal.FundingStep.${i18nKey}.modalText`, {
          amount: depositAmount.toLocaleString("en-US", { style: "decimal" }),
          firstPaymentDate:
            undefined !== confirmationNextPaymentDate
              ? format(parse(confirmationNextPaymentDate, "yyyy-MM-dd", new Date()), "d MMM, yyyy")
              : "-",
        })}
        isVisible={isConfirmationVisible}
        variant="success"
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
