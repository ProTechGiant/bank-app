import { RouteProp, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import SimpleTextInput from "@/components/Input/SimpleTextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { DiamondIcon } from "../assets/icons";
import { CalendarButton, DatePickerModal, EditGoalSummaryModal, ExtendGoalModal } from "../components";
import { RECURRING_FREQUENCIES } from "../constants";
import { GoalGetterStackParams } from "../GoalGetterStack";
import { useGoalGetterOTP } from "../hooks/query-hooks";

export default function ExtendGoal() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const currentDate = new Date();
  const { params } = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.ExtendGoal">>();
  const [extendedDate, setExtendedDate] = useState<Date>(currentDate);
  const [isExtendedDateModalVisible, setIsExtendedDateModalVisible] = useState<boolean>(false);
  const [isRecurringDetailModalVisible, setIsRecurringDetailModalVisible] = useState<boolean>(false);
  const {
    contributionAmount: initialContributionAmount,
    contributionMethods: initialContributionsMethods,
    recurringMethod: initialRecurringMethod,
    targetDate,
    goalId,
  } = params;
  const [contributionAmount, setContributionAmount] = useState<number>(initialContributionAmount);
  const [contributionMethods, setContributionMethods] = useState<string[]>(initialContributionsMethods);
  const [recurringMethod, setRecurringMethod] = useState<string>(initialRecurringMethod);
  const [recurringDay, setRecurringDay] = useState<string>("");
  const [recurringDate, setRecurringDate] = useState<Date>(new Date());
  const [percentage, setPercentage] = useState<number>(0);
  const [isGoalSummaryModalVisible, setIsGoalSummaryModalVisible] = useState<boolean>(false);
  const recurringDateString = format(recurringDate, "yyyy-MM-dd");
  const recurringFrequency =
    RECURRING_FREQUENCIES.find(portfolio => portfolio.PortfolioId === recurringMethod)?.PortfolioName || "";
  const isUpdateButtonDisabled = extendedDate === currentDate;

  const otpFlow = useOtpFlow();
  const { mutateAsync: generateOtp } = useGoalGetterOTP();

  const handleOnUpdateDatePress = () => {
    setIsRecurringDetailModalVisible(true);
  };

  const handleOnUpdateGoalPress = () => {
    setIsRecurringDetailModalVisible(false);
    setIsGoalSummaryModalVisible(true);
  };

  const handelOnSummaryModalConfirmPress = () => {
    try {
      otpFlow.handle({
        action: {
          to: "GoalGetter.GoalManagementSuccessfulScreen",
          params: {
            title: t("GoalGetter.ExtendGoal.successScreen.title"),
            subtitle: t("GoalGetter.ExtendGoal.successScreen.subtitle"),
            icon: <DiamondIcon />,
          },
        },
        otpVerifyMethod: "goals",
        otpOptionalParams: {
          id: goalId,
          TargetDate: targetDate,
          RecurringContributionAmount: contributionAmount,
          RecurringFrequency: recurringMethod === "001" ? "M" : "W",
          RecurringDay: recurringMethod === "001" ? recurringDate : recurringDay,
          Percentage: percentage ? percentage : undefined,
          RecurringAvailability: "ACTIVE",
        },
        onOtpRequest: () => {
          return generateOtp();
        },
      });
    } catch (error) {}
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    flex: 1,
    marginTop: theme.spacing["32p"],
  }));
  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    width: "100%",
  }));
  return (
    <Page>
      <NavHeader
        title={t("GoalGetter.ExtendGoal.title")}
        onBackPress={() => navigation.goBack()}
        end={
          <Pressable onPress={() => navigation.goBack()}>
            <CloseIcon />
          </Pressable>
        }
      />
      <Stack direction="vertical" style={containerStyle} gap="16p" justify="space-between">
        <View>
          <Typography.Header weight="bold" size="large">
            {t("GoalGetter.ExtendGoal.extendingGoal")}
          </Typography.Header>

          <View style={[styles.fullWidth]}>
            <SimpleTextInput label="Original Date" isEditable={false} value={format(targetDate, "dd LLLL u")} />
            <CalendarButton
              label={t("GoalGetter.ExtendGoal.extendedDate")}
              selectedDate={format(extendedDate, "dd LLLL u")}
              onClick={() => setIsExtendedDateModalVisible(true)}
            />
          </View>
        </View>
        <View style={buttonContainerStyle}>
          <Button disabled={isUpdateButtonDisabled} onPress={handleOnUpdateDatePress}>
            <Typography.Text color={isUpdateButtonDisabled ? "neutralBase-20" : "neutralBase-60"}>
              {t("GoalGetter.ExtendGoal.updateDate")}
            </Typography.Text>
          </Button>
        </View>
      </Stack>
      <DatePickerModal
        isVisible={isExtendedDateModalVisible}
        onDateSelected={setExtendedDate}
        onClose={() => setIsExtendedDateModalVisible(false)}
        currentDate={format(extendedDate, "yyyy-MM-dd")}
        withDuration={false}
      />
      <ExtendGoalModal
        isVisible={isRecurringDetailModalVisible}
        setIsVisible={setIsRecurringDetailModalVisible}
        onUpdatePress={handleOnUpdateGoalPress}
        contributionMethods={contributionMethods}
        contributionAmount={contributionAmount}
        recurringFrequency={recurringMethod}
        recurringDate={recurringDate}
        recurringDay={recurringDay}
        percentage={percentage}
        setContributionMethods={setContributionMethods}
        setContributionAmount={setContributionAmount}
        setRecurringFrequency={setRecurringMethod}
        setRecurringDate={setRecurringDate}
        setRecurringDay={setRecurringDay}
        setPercentage={setPercentage}
      />
      <EditGoalSummaryModal
        isVisible={isGoalSummaryModalVisible}
        setIsVisible={setIsGoalSummaryModalVisible}
        onConfirmPress={handelOnSummaryModalConfirmPress}
        name=""
        targetDate={format(targetDate, "dd MMM yyyy")}
        contributionMethods={contributionMethods.join(" ")}
        contributionAmount={contributionAmount}
        recurringMethod={recurringFrequency}
        contributionDate={recurringMethod === "001" ? recurringDateString : recurringDay}
        percentage={percentage}
      />
    </Page>
  );
}
const styles = StyleSheet.create({
  fullWidth: {
    minWidth: "100%",
  },
});
