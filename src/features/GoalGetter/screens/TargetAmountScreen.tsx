import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import addMonths from "date-fns/addMonths";
import arLocale from "date-fns/locale/ar";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, View, ViewStyle } from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";
import * as Yup from "yup";

import { AngleDownIcon } from "@/assets/icons";
import { LargeCurrencyInput } from "@/components";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import DatePickerModal from "../components/DatePickerModal";
import GoalTargetDurationModal from "../components/GoalTargetDurationModal";
import { MAXIMUM_TARGET_AMOUNT, MAXIMUM_TARGET_DURATION, MINIMUM_TARGET_AMOUNT } from "../constants";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { getMinimumValidDate } from "../utils";

type FormInput = {
  amount: number;
  duration: Date | null;
};

type DurationOptions = {
  id: number;
  value: number;
  label: string;
};

export default function TargetAmountScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setGoalContextState, predefinedGoalName } = useGoalGetterContext();

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .min(MINIMUM_TARGET_AMOUNT, t("GoalGetter.targetAmountScreen.validation.minAmount"))
      .max(MAXIMUM_TARGET_AMOUNT, t("GoalGetter.targetAmountScreen.validation.maxAmount"))
      .required(t("GoalGetter.targetAmountScreen.validation.amountRequired")),
    duration: Yup.date()
      .min(getMinimumValidDate(), t("GoalGetter.targetAmountScreen.validation.minDuration"))
      .max(
        new Date(new Date().setFullYear(new Date().getFullYear() + MAXIMUM_TARGET_DURATION)),
        t("GoalGetter.targetAmountScreen.validation.maxDuration")
      )
      .nullable()
      .required(t("GoalGetter.targetAmountScreen.validation.dateRequired")),
  });

  const { control, handleSubmit, getFieldState, formState } = useForm<FormInput>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      amount: 0,
      duration: null,
    },
  });

  const amountState = getFieldState("amount", formState);
  const durationState = getFieldState("duration", formState);

  const [isGoalTargetDateModal, setIsGoalTargetDateModal] = useState(false);
  const [isDatePickerModalVisible, setIsDatePickerModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DurationOptions | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const durationOptions: DurationOptions[] = [
    { id: 1, value: 1, label: t("GoalGetter.targetAmountScreen.month_1") },
    { id: 2, value: 3, label: t("GoalGetter.targetAmountScreen.months_3") },
    { id: 3, value: 6, label: t("GoalGetter.targetAmountScreen.months_6") },
    { id: 4, value: 12, label: t("GoalGetter.targetAmountScreen.months_12") },
    { id: 5, value: 24, label: t("GoalGetter.targetAmountScreen.months_24") },
    { id: 0, value: 0, label: t("GoalGetter.targetAmountScreen.customDate") },
  ];

  const handleApplyButtonPressed = (onChange: (date: Date) => void, nextValue: DurationOptions | null) => {
    if (!nextValue) return;
    setSelectedOption(nextValue);
    setIsGoalTargetDateModal(false);
    setSelectedDate(null);
    const newDate = addMonths(new Date(), nextValue.value);
    onChange(newDate);
  };

  const handleOnSubmit = (data: FormInput) => {
    setGoalContextState({
      targetDate: data.duration?.toISOString(),
      targetAmount: Number(data.amount),
    });
    if (predefinedGoalName !== "Safety net") {
      navigation.navigate("GoalGetter.RisksAppetiteScreen");
    } else {
      // TODO: Navigate to select product screen
      // navigation.navigate("GoalGetter.SelectProductsScreen");
    }
  };
  const handleOnDateChoose = (onChange: (date: Date) => void, date: Date) => {
    setSelectedDate(date);
    onChange(date);
    setIsDatePickerModalVisible(false);
  };

  const handleOnCustomDatePress = () => {
    setIsGoalTargetDateModal(false);
    setIsDatePickerModalVisible(true);
  };

  const formatDate = (date: Date): string => {
    return I18nManager.isRTL ? format(date, "d MMMM yyyy", { locale: arLocale }) : format(date, "d MMM yyyy");
  };

  const primaryButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["20p"],
  }));
  const secondaryButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "flex-start",
    marginTop: -theme.spacing["4p"],
  }));

  const headerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingTop: theme.spacing["24p"],
    justifyContent: "space-between",
    flex: 1,
  }));

  const alertViewStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["16p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={
          <View style={styles.progressIndicator}>
            <ProgressIndicator currentStep={2} totalStep={5} />
          </View>
        }
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.containerFlex}>
        <View style={headerViewStyle}>
          <View>
            <LargeCurrencyInput
              autoFocus
              control={control}
              maxLength={10}
              name="amount"
              testID="GoalGetter.TargetAmountScreen"
              question={t("GoalGetter.targetAmountScreen.question")}
              size="title1"
              currency={t("GoalGetter.targetAmountScreen.currency")}
            />
            <Controller
              name="duration"
              control={control}
              render={({ field: { onChange } }) => (
                <View>
                  <GoalTargetDurationModal
                    isVisible={isGoalTargetDateModal}
                    onSubmit={handleApplyButtonPressed.bind(null, onChange)}
                    onClose={() => setIsGoalTargetDateModal(false)}
                    onCustomDatePress={handleOnCustomDatePress}
                    options={durationOptions}
                  />
                  <DatePickerModal
                    isVisible={isDatePickerModalVisible}
                    onClose={() => setIsDatePickerModalVisible(false)}
                    onDateSelected={handleOnDateChoose.bind(null, onChange)}
                  />
                </View>
              )}
            />
            <View style={secondaryButtonStyle}>
              <Button
                onPress={() => setIsGoalTargetDateModal(true)}
                variant={durationState.error ? "primary-warning" : "secondary"}
                size="small"
                iconRight={<AngleDownIcon />}>
                {selectedDate
                  ? formatDate(selectedDate)
                  : selectedOption
                  ? selectedOption.label
                  : t("GoalGetter.targetAmountScreen.selectDuration")}
              </Button>
            </View>
          </View>
          <View style={alertViewStyle}>
            {amountState.isTouched && amountState.error?.message ? (
              <Alert message={amountState.error.message} variant="error" />
            ) : null}
            {durationState.error?.message ? <Alert message={durationState.error.message} variant="error" /> : null}
          </View>
          <View style={primaryButtonStyle}>
            <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
              {t("GoalGetter.targetAmountScreen.next")}
            </SubmitButton>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerFlex: { flex: 1 },
  progressIndicator: { width: "80%" },
});
