import { RouteProp, useRoute } from "@react-navigation/native";
import { format, parse } from "date-fns";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { CloseIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import { CurrencyInput } from "@/components/Input";
import SmallTextInput from "@/components/Input/SmallTextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { DiamondIcon } from "../assets/icons";
import {
  BottomSheetModal,
  CalendarButton,
  CalenderDayModal,
  ContributionMethodModal,
  DatePickerModal,
  DropDownFieldContainer,
  EditGoalSummaryModal,
  RecommendationModal,
  RecurringFrequencyModal,
} from "../components";
import { PhotoInput } from "../components/PhotoInput";
import { RECURRING_FREQUENCIES, WORKING_WEEK_DAYS } from "../constants";
import { GoalGetterStackParams } from "../GoalGetterStack";
import { useGoalGetterOTP, useGoalSuggestion } from "../hooks/query-hooks";
import { GoalSuggestionResponse, ProductTypeName, RecommendationType, RecommendationTypeEnum } from "../types";

export default function EditGoalScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.EditGoalScreen">>();
  const {
    goalName: initialName,
    targetAmount: initialAmount,
    targetDate: initialDate,
    goalId,
    goalType,
    accountNumber,
  } = params;

  const [goalName, setGoalName] = useState<string>(initialName);
  const [targetAmount, setTargetAmount] = useState<number>(initialAmount);
  const [photo, setPhoto] = useState<string>("");
  const [targetDate, setTargetDate] = useState<Date>(initialDate);
  const [isTargetDateModalVisible, setIsTargetDateModalVisible] = useState<boolean>(false);
  const [contributionMethods, setContributionMethods] = useState<string[]>([]);
  const [isContributionMethodModalVisible, setIsContributionMethodModalVisible] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);
  const [contributionAmount, setContributionAmount] = useState<number>(0);
  const [recurringFrequency, setRecurringFrequency] = useState<string>("");
  const [isRecurringFrequencyModalVisible, setIsRecurringFrequencyModalVisible] = useState<boolean>(false);
  const [isDayModalVisible, setIsDayModalVisible] = useState<boolean>(false);
  const [recurringDate, setRecurringDate] = useState<Date>(new Date());
  const [recurringDay, setRecurringDay] = useState<string>("");
  const recurringDateString = format(recurringDate, "yyyy-MM-dd");
  const recurringMethod =
    RECURRING_FREQUENCIES.find(portfolio => portfolio.PortfolioId === recurringFrequency)?.PortfolioName || "";

  const handleOnSuggestionFinished = (data: GoalSuggestionResponse | undefined, error: unknown) => {
    if (!error && (data?.MonthlyContribution !== undefined || data?.TargetDate !== undefined)) {
      setIsRecommendationModalVisible(true);
    } else {
      navigateToGoalSummaryScreen();
    }
  };

  const otpFlow = useOtpFlow();
  const { mutateAsync: generateOtp } = useGoalGetterOTP();

  const {
    refetch: getSuggestion,
    data,
    isFetching: isFetchingSuggestion,
  } = useGoalSuggestion({
    goalId,
    TargetAmount: targetAmount,
    TargetDate: targetDate,
    MonthlyContribution: contributionAmount,
    onSettled: handleOnSuggestionFinished,
  });
  const recommendations: RecommendationType[] = useMemo(
    () => [
      {
        type: RecommendationTypeEnum.AMOUNT,
        recommended: data?.MonthlyContribution || undefined,
        original: contributionAmount,
      },
      {
        type: RecommendationTypeEnum.DATE,
        recommended: data?.TargetDate ? parse(data.TargetDate, "yyyy-MM-dd HH:mm:ss", new Date()) : undefined,
        original: targetDate,
      },
    ],
    [contributionAmount, targetDate, data]
  );

  const [isRecommendationModalVisible, setIsRecommendationModalVisible] = useState<boolean>(false);
  const [isRecommendationsSelected, setIsRecommendationsSelected] = useState<boolean[]>(
    recommendations.map(() => false)
  );

  const [isSummaryModalVisible, setIsSummaryModalVisible] = useState<boolean>(false);

  const handleOnUploadPhoto = data => {
    setPhoto(data?.uri ?? "");
  };
  const handleOnContinueButtonPress = () => {
    getSuggestion();
  };

  const handleOnToggleSelectedRecommendation = (index: number) => {
    setIsRecommendationsSelected(r => {
      r[index] = !r[index];
      return [...r];
    });
  };
  const handleOnUpdateRecommendationPress = () => {
    if (isRecommendationsSelected[0]) setContributionAmount(recommendations[0].recommended as number);
    if (isRecommendationsSelected[1]) setTargetDate(recommendations[1].recommended as Date);
    setIsRecommendationModalVisible(false);
    navigateToGoalSummaryScreen();
  };

  const handleOnRecommendationProceedPress = () => {
    setIsRecommendationModalVisible(false);
    navigateToGoalSummaryScreen();
  };

  const navigateToGoalSummaryScreen = () => {
    setIsSummaryModalVisible(true);
  };

  const handelOnSummaryModalConfirmPress = () => {
    try {
      otpFlow.handle({
        action: {
          to: "GoalGetter.GoalManagementSuccessfulScreen",
          params: {
            title: t("GoalGetter.EditGoalGetter.successScreen.title"),
            subtitle: t("GoalGetter.EditGoalGetter.successScreen.subtitle"),
            icon: <DiamondIcon />,
          },
        },
        otpVerifyMethod: "goals",
        otpOptionalParams: {
          id: goalId,
          Name: goalName,
          UploadedImage: photo,
          GalleryImage: photo,
          AccountNumber: accountNumber,
          TargetAmount: targetAmount,
          TargetDate: targetDate,
          RecurringAvailability: "ACTIVE",
          RecurringContributionAmount: contributionAmount,
          RecurringFrequency: recurringFrequency === "001" ? "M" : "W",
          RecurringDay: recurringFrequency === "001" ? recurringDate : recurringDay,
          Percentage: percentage ? percentage : undefined,
        },
        onOtpRequest: () => {
          return generateOtp();
        },
      });
    } catch (error) {}
  };

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
  const continueButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["24p"],
    marginTop: theme.spacing["32p"],
  }));

  return (
    <Page insets={["bottom", "top", "left", "right"]} backgroundColor="neutralBase-60">
      <NavHeader
        title={t("GoalGetter.EditGoalGetter.label")}
        onBackPress={() => navigation.goBack()}
        end={
          <Pressable onPress={() => navigation.goBack()}>
            <CloseIcon />
          </Pressable>
        }
      />
      <ScrollView style={styles.fullSize} showsHorizontalScrollIndicator={true}>
        <Stack direction="vertical" gap="24p" style={[containerStyle, styles.fullWidth]}>
          <Typography.Text size="title1" weight="bold">
            {t("GoalGetter.EditGoalGetter.goalInformation")}
          </Typography.Text>
          <View style={styles.fullWidth}>
            <SmallTextInput label="Write your goal’s name" value={goalName} onChangeText={setGoalName} />
          </View>
          <View style={styles.fullWidth}>
            <Typography.Text weight="bold">{t("GoalGetter.EditGoalGetter.InputsLabels.goalPhoto")}</Typography.Text>

            <PhotoInput
              handleOnPredefinedPress={() => console.log("Predefined Press")}
              onChange={handleOnUploadPhoto}
            />
          </View>
          <View style={[gap8Style, styles.fullWidth]}>
            <Typography.Text weight="bold">{t("GoalGetter.EditGoalGetter.InputsLabels.targetAmount")}</Typography.Text>
            <CurrencyInput label="" value={targetAmount} onChange={setTargetAmount} />
          </View>
          <View style={[styles.fullWidth]}>
            <Typography.Text weight="bold">{t("GoalGetter.EditGoalGetter.InputsLabels.targetDate")}</Typography.Text>
            <CalendarButton
              selectedDate={format(targetDate, "dd LLLL u")}
              onClick={() => setIsTargetDateModalVisible(true)}
            />
            <DatePickerModal
              isVisible={isTargetDateModalVisible}
              onDateSelected={setTargetDate}
              onClose={() => setIsTargetDateModalVisible(false)}
              currentDate={format(targetDate, "yyyy-MM-dd")}
              withDuration={false}
            />
          </View>
        </Stack>
        <Divider color="neutralBase-40" height={4} />
        <Stack direction="vertical" gap="24p" style={[containerStyle, styles.fullWidth, bottomStackStyle]}>
          <Typography.Text size="title1" weight="bold">
            {t("GoalGetter.EditGoalGetter.InputsLabels.setUpContribution")}
          </Typography.Text>
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
            <CurrencyInput
              label=""
              value={contributionAmount}
              onChange={setContributionAmount}
              currency={goalType === ProductTypeName.GOLD ? "grams" : "SAR"}
            />
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
        <View style={continueButtonStyle}>
          <Button
            onPress={handleOnContinueButtonPress}
            loading={isFetchingSuggestion}
            disabled={contributionAmount === 0}>
            <Typography.Text color="neutralBase-60">
              {t("GoalGetter.EditGoalGetter.ButtonsText.continue")}
            </Typography.Text>
          </Button>
        </View>
      </ScrollView>
      <ContributionMethodModal
        isVisible={isContributionMethodModalVisible}
        onClose={() => setIsContributionMethodModalVisible(false)}
        onValueChange={setContributionMethods}
      />
      <RecommendationModal
        recommendations={recommendations}
        isVisible={isRecommendationModalVisible}
        setIsVisible={setIsRecommendationModalVisible}
        toggleRecommendation={handleOnToggleSelectedRecommendation}
        selected={isRecommendationsSelected}
        onUpdatePress={handleOnUpdateRecommendationPress}
        onProceedPress={handleOnRecommendationProceedPress}
      />
      <EditGoalSummaryModal
        isVisible={isSummaryModalVisible}
        setIsVisible={setIsSummaryModalVisible}
        onConfirmPress={handelOnSummaryModalConfirmPress}
        name={goalName}
        image={photo}
        targetAmount={targetAmount}
        targetDate={format(targetDate, "dd MMM yyyy")}
        contributionAmount={contributionAmount}
        contributionMethods={contributionMethods.join(" ")}
        recurringMethod={recurringMethod}
        contributionDate={recurringFrequency === "001" ? recurringDateString : recurringDay}
        percentage={percentage}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  fullSize: {
    flex: 1,
  },
  fullWidth: {
    minWidth: "100%",
  },
});
