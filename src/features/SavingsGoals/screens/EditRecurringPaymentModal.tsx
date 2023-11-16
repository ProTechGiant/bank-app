import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { parse } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, Keyboard, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as yup from "yup";

import { LargeCurrencyInput } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import DayPickerInput from "@/components/Form/DayPickerInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { useCurrentAccount } from "@/hooks/use-accounts";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AccountDestination } from "../components";
import { PAYMENT_FREQUENCY } from "../constants";
import { setDateAndFormatRecurringPayment } from "../helpers";
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

  useEffect(() => {
    if (recurringFundData) {
      const date = parseInt(recurringFundData.PaymentFrequency, 10).toString();
      const dayOfMonth = parse(date, "yyyyMMdd", new Date()).getDate();

      setValue("PaymentAmount", Number(recurringFundData.PaymentAmount));
      setValue("DayOfMonth", dayOfMonth);
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
        PaymentFrequency: `${formattedDate} ${PAYMENT_FREQUENCY}`,
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
          testID="SavingsGoals.EditRegularPaymentModal:NavHeader"
        />
        <ContentContainer style={styles.content}>
          <Stack align="stretch" direction="vertical" gap="16p">
            <LargeCurrencyInput
              autoFocus
              control={control}
              maxLength={10}
              name="PaymentAmount"
              returnKeyType="done"
              isAmountExceedsBalance={undefined !== savingsPotData && Number(watch("PaymentAmount")) > accountBalance}
              testID="SavingsGoals.EditRegularPaymentModal:PaymentAmountInput"
            />
            <DayPickerInput
              buttonText={t("SavingsGoals.EditRegularPaymentModal.dayPickerButton")}
              control={control}
              headerText={t("SavingsGoals.EditRegularPaymentModal.dayPickerHeader")}
              label={t("SavingsGoals.EditRegularPaymentModal.monthly")}
              name="DayOfMonth"
              placeholder={t("SavingsGoals.EditRegularPaymentModal.dayPickerPlaceholder")}
              testID="SavingsGoals.EditRegularPaymentModal:DayOfMonthInput"
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
            <SubmitButton
              control={control}
              onSubmit={handleSubmit(handleOnSubmit)}
              testID="SavingsGoals.EditRegularPaymentModal:SaveButton">
              {t("SavingsGoals.EditRegularPaymentModal.saveButton")}
            </SubmitButton>
            <Button
              onPress={handleOnShowRemoveRecurringPaymentModal}
              variant="warning"
              testID="SavingsGoals.EditRegularPaymentModal:RemoveButton">
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
            <Button onPress={handleOnPressRemoval} testID="SavingsGoals.EditRegularPaymentModal:RemoveConfirmButton">
              {t("SavingsGoals.EditRegularPaymentModal.removalModal.confirmButton")}
            </Button>
          ),
          secondary: (
            <Button
              onPress={() => setRemoveRecurringPaymentModal(current => !current)}
              testID="SavingsGoals.EditRegularPaymentModal:RemoveCancelButton">
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
