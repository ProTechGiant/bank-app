import { format } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { Modal, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import { CurrencyInput } from "@/components/Input";
import { useThemeStyles } from "@/theme";

import { RECURRING_FREQUENCIES, WORKING_WEEK_DAYS } from "../constants";
import BottomSheetModal from "./BottomSheetModal";
import CalendarButton from "./CalendarButton";
import CalenderDayModal from "./CalenderDayModal";
import ContributionMethodModal from "./ContributionMethodModal";
import DropDownFieldContainer from "./DropDownFieldContainer";
import RecurringFrequencyModal from "./RecurringFrequencyModal";

interface ExtendGoalModalProps {
  isVisible: boolean;
  setIsVisible: (status: boolean) => void;
  onUpdatePress: () => void;
  contributionMethods: string[];
  contributionAmount: number;
  recurringFrequency: string;
  recurringDate: Date;
  recurringDay: string;
  percentage: number;
  setContributionMethods: (values: string[]) => void;
  setContributionAmount: (value: number) => void;
  setRecurringFrequency: (value: string) => void;
  setRecurringDate: (value: Date) => void;
  setRecurringDay: (value: string) => void;
  setPercentage: (value: number) => void;
}
export default function ExtendGoalModal({
  isVisible,
  setIsVisible,
  onUpdatePress,
  contributionAmount,
  recurringDate,
  recurringDay,
  percentage,
  contributionMethods,
  setContributionAmount,
  setRecurringDate,
  setRecurringDay,
  setContributionMethods,
  setRecurringFrequency,
  setPercentage,
  recurringFrequency,
}: ExtendGoalModalProps) {
  const { t } = useTranslation();
  const [isContributionMethodModalVisible, setIsContributionMethodModalVisible] = useState<boolean>(false);
  const [isRecurringFrequencyModalVisible, setIsRecurringFrequencyModalVisible] = useState<boolean>(false);
  const [isDayModalVisible, setIsDayModalVisible] = useState<boolean>(false);
  const recurringDateString = format(recurringDate, "yyyy-MM-dd");
  const recurringMethod =
    RECURRING_FREQUENCIES.find(portfolio => portfolio.PortfolioId === recurringFrequency)?.PortfolioName || "";

  const gap8Style = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["8p"],
  }));
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));
  const bottomStackStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
  }));
  const recurringFrequencyModalStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.small,
    paddingHorizontal: theme.spacing["8p"],
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: "100%",
    minHeight: 65,
    alignItems: "center",
  }));

  return (
    <Modal
      style={styles.modalStyle}
      headerText={t("GoalGetter.ExtendGoal.title")}
      onClose={() => setIsVisible(false)}
      onBack={() => setIsVisible(false)}
      visible={isVisible}>
      <Stack direction="vertical" justify="space-between" style={styles.containerStyle}>
        <Stack direction="vertical" gap="24p" style={[containerStyle, styles.fullWidth, bottomStackStyle]}>
          <Typography.Header weight="bold" size="large">
            {t("GoalGetter.ExtendGoal.recurringDetail")}
          </Typography.Header>
          <DropDownFieldContainer
            title={t("GoalGetter.EditGoalGetter.InputsLabels.contributionMethod")}
            value={contributionMethods.join(", ")}
            onPress={() => setIsContributionMethodModalVisible(true)}
          />
          {contributionMethods.includes(t("GoalGetter.ShapeYourGoalContributions.Percentage")) ? (
            <View style={[gap8Style, styles.fullWidth]}>
              <Typography.Text>{t("GoalGetter.EditGoalGetter.InputsLabels.percentage")}</Typography.Text>
              <CurrencyInput label="" value={percentage} onChange={setPercentage} currency="%" />
            </View>
          ) : null}

          <View style={[gap8Style, styles.fullWidth]}>
            <Typography.Text>{t("GoalGetter.EditGoalGetter.InputsLabels.contributionAmount")}</Typography.Text>
            <CurrencyInput label="" value={contributionAmount} onChange={setContributionAmount} />
          </View>

          {contributionMethods.includes(t("GoalGetter.ShapeYourGoalContributions.Recurring")) ? (
            <>
              <Stack direction="vertical" style={styles.fullWidth}>
                <Typography.Text>{t("GoalGetter.ShapeYourGoalContributions.recurringFrequency")}</Typography.Text>
                <Pressable
                  style={recurringFrequencyModalStyle}
                  onPress={() => setIsRecurringFrequencyModalVisible(true)}>
                  <Typography.Text>
                    {recurringFrequency ? recurringMethod : t("GoalGetter.ShapeYourGoalContributions.selectFrequency")}
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
              <View style={styles.fullWidth}>
                {recurringFrequency === "001" ? (
                  <View style={[styles.fullWidth, gap8Style]}>
                    <Typography.Text>{t("GoalGetter.ShapeYourGoalContributions.recurringDay")}</Typography.Text>
                    <CalendarButton selectedDate={recurringDateString} onClick={() => setIsDayModalVisible(true)} />
                    <CalenderDayModal
                      onDateSelected={setRecurringDate}
                      onClose={() => setIsDayModalVisible(false)}
                      isVisible={isDayModalVisible}
                      currentDate={recurringDateString}
                    />
                  </View>
                ) : (
                  <View style={[styles.fullWidth, gap8Style]}>
                    <Typography.Text>{t("GoalGetter.ShapeYourGoalContributions.recurringDay")}</Typography.Text>
                    <BottomSheetModal
                      buttonLabel={t("Settings.FinancialInformation.selectButton")}
                      options={WORKING_WEEK_DAYS}
                      onChange={setRecurringDay}
                      value={recurringDay}
                      label={t("GoalGetter.ShapeYourGoalContributions.selectDay")}
                    />
                  </View>
                )}
              </View>
            </>
          ) : null}
        </Stack>
        <View style={styles.fullWidth}>
          <Button onPress={onUpdatePress}>
            <Typography.Text color="neutralBase-60">{t("GoalGetter.ExtendGoal.update")}</Typography.Text>
          </Button>
        </View>
      </Stack>

      <ContributionMethodModal
        isVisible={isContributionMethodModalVisible}
        onClose={() => setIsContributionMethodModalVisible(false)}
        onValueChange={setContributionMethods}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    height: "90%",
    justifyContent: "space-between",
  },
  fullWidth: {
    bottom: 0,
    width: "100%",
  },
  modalStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    flex: 1,
    height: "100%",
    justifyContent: "space-between",
  },
});
