import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { isThisMonth, parse } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, Keyboard, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as yup from "yup";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import DayPickerInput from "@/components/Form/DayPickerInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useCurrentAccount } from "@/hooks/use-accounts";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AccountDestination, LargeCurrencyInput } from "../components";
import { isNextMonth, setDateAndFormatRecurringPayment } from "../helpers";
import {
  useDeletePotRecurringPayment,
  useEditPotRecurringPayment,
  useRecurringPayments,
  useSavingsPot,
} from "../hooks/query-hooks";

interface FundingInput {
  PaymentAmount: number;
  DayOfMonth: number;
}

export default function EditRecurringPaymentModal() {
  const route = useRoute<RouteProp<AuthenticatedStackParams, "SavingsGoals.EditRecurringPaymentModal">>();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const editRecurringPayment = useEditPotRecurringPayment(); //TODO: will be used once BE is complete
  const deleteRecurringPayment = useDeletePotRecurringPayment(); //TODO: will be used once BE is complete
  const { PotId } = route.params;
  const { data: savingsPotData } = useSavingsPot(PotId);
  const { data: recurringFundData } = useRecurringPayments(PotId);
  const { data: { balance: accountBalance = 0 } = {} } = useCurrentAccount();

  const [removeRecurringPaymentModal, setRemoveRecurringPaymentModal] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

  const buttonSpaceStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
  }));

  const handleOnCloseModal = () => {
    navigation.goBack();
  };

  const today = useMemo(() => new Date(), []);
  const targetDate = useMemo(
    () => (savingsPotData?.TargetDate ? parse(savingsPotData?.TargetDate, "yyyy-MM-dd", today) : undefined),
    [savingsPotData?.TargetDate, today]
  );

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      PaymentAmount: yup
        .number()
        .required()
        .min(0.01, t("SavingsGoals.EditRegularPaymentModal.required"))
        .when("DayOfMonth", {
          // when Regular payment is today, the user must have sufficient balance
          is: (value: number) => value === today.getDate(),
          then: yup.number().max(accountBalance, t("SavingsGoals.EditRegularPaymentModal.amountExceedsBalance")),
        }),
    });
  }, [accountBalance, t, today]);

  const handleOnPressRemoval = async () => {
    setRemoveRecurringPaymentModal(current => !current);
    try {
      await deleteRecurringPayment.mutateAsync({ PotId: PotId });
      navigation.navigate("SavingsGoals.GoalDetailsScreen", { PotId, isRecurringPaymentRemoved: true });
    } catch (error) {
      Alert.alert(t("errors.generic.title"), t("errors.generic.message"));
    }
  };

  //TODO: designed using LLD's need to wait for BE completion to complete

  const handleOnShowRemoveRecurringPaymentModal = () => {
    setRemoveRecurringPaymentModal(!removeRecurringPaymentModal);
  };

  const { control, handleSubmit, watch, setValue } = useForm<FundingInput>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  //     //Currently CBS doesn't return "PaymentFrequency" as a date or number, it is a string that says "Monthly", "daily" etc.
  //     //so day picker currently shows on NaNth as the default value
  //     //this is being worked on right now and is a known bug, was told to push forward.
  useEffect(() => {
    if (recurringFundData) {
      setValue("PaymentAmount", Number(recurringFundData.PaymentAmount));
      setValue("DayOfMonth", parseInt(recurringFundData.PaymentFrequency, 10));
    } else {
      setValue("PaymentAmount", 0);
      setValue("DayOfMonth", new Date().getDate());
    }
  }, [recurringFundData, setValue]);

  const handleOnSubmit = async (values: FundingInput) => {
    if (undefined === recurringFundData) return Promise.resolve();
    if (undefined === savingsPotData) return Promise.resolve();

    Keyboard.dismiss();

    const formattedDate = setDateAndFormatRecurringPayment(values.DayOfMonth);

    // normally using async executors isnt a necessary. but in this case it is, because the Alert
    // allows to retry the submitting and we want to "remember" the loading state of the form
    // so it needs to pass through the submit process

    const stringPaymentAmount = values.PaymentAmount.toString();

    try {
      await editRecurringPayment.mutateAsync({
        Currency: "SAR",
        DebtorAccount: recurringFundData.DomesticStandingOrderId,
        PotId: savingsPotData.PotId,
        PaymentAmount: stringPaymentAmount,
        PaymentFrequency: `${formattedDate} e0Y e1M e0W e0D`,
      });
      navigation.goBack();
    } catch (error) {
      setIsErrorModalVisible(true);
    }
  };

  return (
    <SafeAreaProvider>
      <Page>
        <NavHeader
          title={t("SavingsGoals.EditRegularPaymentModal.title")}
          withBackButton={false}
          end={<NavHeader.CloseEndButton onPress={handleOnCloseModal} />}
        />
        <ContentContainer style={styles.content}>
          <Stack align="stretch" direction="vertical" gap="16p">
            <LargeCurrencyInput
              autoFocus
              control={control}
              helperText={currentValue => {
                if (undefined !== savingsPotData && currentValue > accountBalance) {
                  const amountExceedsBalance = (
                    <Typography.Text color="errorBase">
                      {t("SavingsGoals.EditRegularPaymentModal.amountExceedsBalance")}
                    </Typography.Text>
                  );
                  return amountExceedsBalance;
                }
              }}
              maxLength={10}
              name="PaymentAmount"
              returnKeyType="done"
              isAmountExceedsBalance={undefined !== savingsPotData && Number(watch("PaymentAmount")) > accountBalance}
            />
            <DayPickerInput
              buttonText={t("SavingsGoals.EditRegularPaymentModal.dayPickerButton")}
              control={control}
              headerText={t("SavingsGoals.EditRegularPaymentModal.dayPickerHeader")}
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
                    return t("SavingsGoals.EditRegularPaymentModal.helperIfDayIsAfterTarget");
                  }
                }

                if (currentValue > 28) return t("SavingsGoals.EditRegularPaymentModal.helperIfDayExceeds28");
              }}
              label={t("SavingsGoals.EditRegularPaymentModal.monthly")}
              name="DayOfMonth"
              placeholder={t("SavingsGoals.EditRegularPaymentModal.dayPickerPlaceholder")}
            />

            {savingsPotData !== undefined ? (
              <AccountDestination
                destination={t("SavingsGoals.Account.from")}
                accountName={t("SavingsGoals.Account.mainAccount")}
                balance={accountBalance}
              />
            ) : null}
          </Stack>
          <View style={buttonSpaceStyle}>
            <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
              {t("SavingsGoals.EditRegularPaymentModal.saveButton")}
            </SubmitButton>
            <Button onPress={handleOnShowRemoveRecurringPaymentModal} variant="warning">
              {t("SavingsGoals.EditRegularPaymentModal.removeButton")}
            </Button>
          </View>
        </ContentContainer>
      </Page>
      <NotificationModal
        variant="confirmations"
        message={t("SavingsGoals.EditRegularPaymentModal.removalModal.message")}
        title={t("SavingsGoals.EditRegularPaymentModal.removalModal.title")}
        isVisible={removeRecurringPaymentModal}
        buttons={{
          primary: (
            <Button onPress={handleOnPressRemoval}>
              {t("SavingsGoals.EditRegularPaymentModal.removalModal.confirmButton")}
            </Button>
          ),
          secondary: (
            <Button onPress={() => setRemoveRecurringPaymentModal(current => !current)}>
              {t("SavingsGoals.EditRegularPaymentModal.removalModal.cancelButton")}
            </Button>
          ),
        }}
      />
      <NotificationModal
        buttons={{
          primary: (
            <Button loading={editRecurringPayment.isLoading} onPress={handleSubmit(handleOnSubmit)}>
              {t("SavingsGoals.EditRegularPaymentModal.errorTryAgain")}
            </Button>
          ),
          secondary: (
            <Button onPress={() => navigation.goBack()}>{t("SavingsGoals.EditRegularPaymentModal.errorNotNow")}</Button>
          ),
        }}
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        variant="error"
      />
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
});
