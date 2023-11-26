import { format } from "date-fns";
import { useState } from "react";
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
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import {
  BottomSheetModal,
  CalendarButton,
  CalenderDayModal,
  ContributionMethodModal,
  DatePickerModal,
  DropDownFieldContainer,
  RecommendationModal,
  RecurringFrequencyModal,
} from "../components";
import { PhotoInput } from "../components/PhotoInput";
import { RECURRING_FREQUENCIES, WORKING_WEEK_DAYS } from "../constants";
import { RecommendationType, RecommendationTypeEnum } from "../types";

export default function EditGoalScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  //TODO change all the initial values to get from the BE
  const recommendations: RecommendationType[] = [
    {
      type: RecommendationTypeEnum.AMOUNT,
      recommended: 1000,
      original: 500,
    },
    {
      type: RecommendationTypeEnum.DATE,
      recommended: new Date(),
      original: new Date(),
    },
  ];
  const [goalName, setGoalName] = useState<string>("Rainy Day");
  const [targetAmount, setTargetAmount] = useState<number>(5000);
  const [photo, setPhoto] = useState<string>("");
  const [targetDate, setTargetDate] = useState<Date>(new Date());
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

  const [isRecommendationModalVisible, setIsRecommendationModalVisible] = useState<boolean>(false);
  const [isRecommendationsSelected, setIsRecommendationsSelected] = useState<boolean[]>(
    recommendations.map(() => false)
  );

  const handleOnUploadPhoto = data => {
    setPhoto(data?.uri ?? "");
    //TODO remove this log and use photo in the next screen
    console.log(photo);
  };
  const handleOnContinueButtonPress = () => {
    //TODO get the condition to navigate to the khalid screen or the modal from BE
    setIsRecommendationModalVisible(true);
  };

  const handleOnToggleSelectedRecommendation = (index: number) => {
    setIsRecommendationsSelected(r => {
      r[index] = !r[index];
      return [...r];
    });
  };
  const handleOnUpdateRecommendationPress = () => {
    //TODO
  };

  const handleOnRecommendationProceedPress = () => {
    //TODO
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
          {contributionMethods.includes(t("GoalGetter.ShapeYourGoalContributions.Recurring")) ? (
            <View style={[gap8Style, styles.fullWidth]}>
              <Typography.Text>{t("GoalGetter.EditGoalGetter.InputsLabels.contributionAmount")}</Typography.Text>
              <CurrencyInput label="" value={contributionAmount} onChange={setContributionAmount} />
            </View>
          ) : null}

          <Stack direction="vertical" style={styles.fullWidth}>
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
        </Stack>
        <View style={continueButtonStyle}>
          <Button onPress={handleOnContinueButtonPress}>
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
