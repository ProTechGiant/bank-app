import { format } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { Modal, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { CheckboxInput, CurrencyInput } from "@/components/Input";
import { useThemeStyles } from "@/theme";

import { RECURRING_FREQUENCIES, WORKING_WEEK_DAYS } from "../constants";
import BottomSheetModal from "./BottomSheetModal";
import CalendarButton from "./CalendarButton";
import CalenderDayModalModal from "./CalenderDayModal";
import RecurringFrequencyModal from "./RecurringFrequencyModal";
interface RecurringGoldModalProps {
  isVisible: boolean;
  maxLimit: number;
  recurringFrequency: string;
  recurringDate: Date;
  recurringDay: string;
  isContinueButtonDisabled: boolean;
  setIsVisible: (visible: boolean) => void;
  setMaxLimit: (limit: number) => void;
  setRecurringFrequency: (freq: string) => void;
  setRecurringDate: (date: Date) => void;
  setRecurringDay: (day: string) => void;
  onSubmit: () => void;
}

export default function RecurringGoldModal({
  isVisible,
  maxLimit,
  recurringFrequency,
  recurringDate,
  recurringDay,
  isContinueButtonDisabled,
  setIsVisible,
  setMaxLimit,
  setRecurringFrequency,
  setRecurringDate,
  setRecurringDay,
  onSubmit,
}: RecurringGoldModalProps) {
  const { t } = useTranslation();

  const recurringDateString = format(recurringDate, "yyyy-MM-dd");

  const [isRecurringFrequencyModalVisible, setIsRecurringFrequencyModalVisible] = useState<boolean>(false);
  const [isDayModalVisible, setIsDayModalVisible] = useState<boolean>(false);
  const [isAgreeToCondition, setIsAgreedToCondition] = useState<boolean>(false);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["24p"],
  }));

  const maxLimitNoteStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));

  const primaryButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "flex-end",
    gap: theme.spacing["16p"],
  }));

  const stackAmountStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const recurringFrequencyModalStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.small,
    paddingHorizontal: theme.spacing["8p"],
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    minHeight: 65,
    alignItems: "center",
  }));

  const recurringMarginBottom = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["12p"],
  }));

  const subTitleMarginBottom = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <Modal
      onBack={() => setIsVisible(false)}
      headerText="Shape your goal"
      style={styles.modalStyle}
      visible={isVisible}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={containerStyle}>
        <Stack direction="vertical" gap="8p">
          <Typography.Text color="primaryBase" size="title3" weight="bold">
            {t("GoalGetter.GoldPendingScreen.setContribution")}
          </Typography.Text>
          <Typography.Text style={subTitleMarginBottom}>
            {t("GoalGetter.GoldPendingScreen.RecurringModal.enterRecurringSettings")}
          </Typography.Text>
        </Stack>

        <Stack direction="vertical" gap="12p" style={stackAmountStyle}>
          <Typography.Text weight="bold">{t("GoalGetter.GoldPendingScreen.RecurringModal.maxLimit")}</Typography.Text>
          <View style={styles.containerInputStyle}>
            <CurrencyInput label="" value={maxLimit} onChange={setMaxLimit} />
          </View>
          <Typography.Text size="footnote" style={maxLimitNoteStyle} color="neutralBase+10">
            {t("GoalGetter.GoldPendingScreen.RecurringModal.maxLimitNote")}
          </Typography.Text>
        </Stack>

        <Stack direction="vertical" gap="12p" style={stackAmountStyle}>
          <Typography.Text>{t("GoalGetter.ShapeYourGoalContributions.recurringFrequency")}</Typography.Text>
          <Pressable style={recurringFrequencyModalStyle} onPress={() => setIsRecurringFrequencyModalVisible(true)}>
            <Typography.Text>
              {recurringFrequency
                ? RECURRING_FREQUENCIES.find(portfolio => portfolio.PortfolioId === recurringFrequency)?.PortfolioName
                : t("GoalGetter.ShapeYourGoalContributions.selectFrequency")}
            </Typography.Text>
          </Pressable>
        </Stack>
        <RecurringFrequencyModal
          isVisible={isRecurringFrequencyModalVisible}
          selected={recurringFrequency}
          list={RECURRING_FREQUENCIES}
          onClose={() => setIsRecurringFrequencyModalVisible(false)}
          onSelect={value => (value ? setRecurringFrequency(value) : null)}
        />
        {recurringFrequency === "001" ? (
          <View>
            <Typography.Text>{t("GoalGetter.ShapeYourGoalContributions.recurringDay")}</Typography.Text>
            <CalendarButton selectedDate={recurringDateString} onClick={() => setIsDayModalVisible(true)} />
            <CalenderDayModalModal
              onDateSelected={setRecurringDate}
              onClose={() => setIsDayModalVisible(false)}
              isVisible={isDayModalVisible}
              currentDate={recurringDateString}
            />
          </View>
        ) : (
          <View>
            <Typography.Text style={recurringMarginBottom}>
              {t("GoalGetter.ShapeYourGoalContributions.recurringDay")}
            </Typography.Text>
            <BottomSheetModal
              buttonLabel={t("Settings.FinancialInformation.selectButton")}
              options={WORKING_WEEK_DAYS}
              onChange={setRecurringDay}
              value={recurringDay}
              label={t("GoalGetter.ShapeYourGoalContributions.selectDay")}
            />
          </View>
        )}

        <View style={primaryButtonStyle}>
          <CheckboxInput
            onChange={setIsAgreedToCondition}
            value={isAgreeToCondition}
            label={t("GoalGetter.GoldPendingScreen.RecurringModal.condition")}
          />
          <Button disabled={isContinueButtonDisabled || !isAgreeToCondition} onPress={onSubmit}>
            {t("GoalGetter.GoldPendingScreen.continue")}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  containerInputStyle: {
    width: "100%",
  },
  modalStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    height: "100%",
    width: "100%",
  },
});
