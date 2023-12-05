import { yupResolver } from "@hookform/resolvers/yup";
import format from "date-fns/format";
import arLocale from "date-fns/locale/ar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import * as yup from "yup";

import { Stack } from "@/components";
import Button from "@/components/Button";
import CustomStatusBar from "@/components/CustomStatusBar/CustomStatusBar";
import CurrencyInput from "@/components/Form/CurrencyInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { BottomSheetModal, CalendarButton, CalenderDayModal, RecurringFrequencyModal } from "../components";
import { RECURRING_FREQUENCIES, WORKING_WEEK_DAYS } from "../constants";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { useGetProductContribution } from "../hooks/query-hooks";

interface GoalAmount {
  selectedDay: string;
  InitialContribution: number;
  RecurringFrequency: number;
}

export default function ContributionScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [daysCalenderIsVisible, setDaysCalenderIsVisible] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const { setGoalContextState, ProductId } = useGoalGetterContext();
  const { data: productContributionValidations } = useGetProductContribution(ProductId);

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
  };

  const [recurringFrequencyValue, setRecurringFrequencyValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const validationAmountSchema = yup.object().shape({
    InitialContribution: yup
      .number()
      .nullable()
      .min(
        productContributionValidations?.MinimumInitial,
        t("GoalGetter.ShapeGoalScreen.error.minTargetAmount", { value: productContributionValidations?.MinimumInitial })
      )
      .max(
        productContributionValidations?.AvailableContribution,
        t("GoalGetter.ShapeGoalScreen.error.maxTargetAmount", {
          value: productContributionValidations?.AvailableContribution,
        })
      ),

    RecurringFrequency: yup
      .number()
      .nullable()
      .min(
        productContributionValidations?.MinimumInitial,
        t("GoalGetter.ShapeGoalScreen.error.minTargetAmount", {
          value: productContributionValidations?.MinimumInitial,
        })
      )
      .max(
        productContributionValidations?.AvailableContribution,
        t("GoalGetter.ShapeGoalScreen.error.maxTargetAmount", {
          value: productContributionValidations?.AvailableContribution,
        })
      ),
  });

  const { control, formState, handleSubmit } = useForm<GoalAmount>({
    resolver: yupResolver(validationAmountSchema),
    mode: "onBlur",
    defaultValues: { InitialContribution: 0, RecurringFrequency: 0 },
  });

  const getRecurringFrequency = () => {
    return RECURRING_FREQUENCIES.find(portfolio => portfolio.PortfolioId === recurringFrequencyValue)?.PortfolioName;
  };

  const handleOnSubmit = (data: GoalAmount) => {
    setGoalContextState({
      InitialContribution: data.InitialContribution,
      RecurringFrequency: getRecurringFrequency(),
      RecurringContribution: data.RecurringFrequency,
      RecurringDate:
        getRecurringFrequency() === t("GoalGetter.ShapeYourGoalContributions.Monthly") ? selectedDate : selectedValue,
    });
    navigation.navigate("GoalGetter.CreateGoalScreen");
  };
  const handleOnSkip = () => {
    navigation.navigate("GoalGetter.CreateGoalScreen");
  };

  const handleSelectRecurringFrequencyValue = (value: string | null) => {
    if (value !== null) {
      setRecurringFrequencyValue(value);
    }
  };
  const currentDate = new Date().toISOString().split("T")[0];

  const handleValidation = () => {
    const isInitialAndRecurringValid =
      formState.dirtyFields.InitialContribution &&
      formState.dirtyFields.RecurringFrequency &&
      !formState.errors?.InitialContribution &&
      !formState.errors?.RecurringFrequency;

    const isFrequencySelected = recurringFrequencyValue !== "";

    let isDayOrDateSelected = false;
    if (recurringFrequencyValue === "002") {
      isDayOrDateSelected = selectedValue !== "";
    } else if (recurringFrequencyValue === "001") {
      isDayOrDateSelected = selectedDate !== "" && selectedDate !== currentDate;
    }

    return isInitialAndRecurringValid && isFrequencySelected && isDayOrDateSelected;
  };

  const handleOnCloseRecurringFrequencyModal = () => {
    setIsVisible(false);
  };

  const handleOnSelectDate = (date: Date) => {
    const currentDate = new Date();
    if (currentDate.toDateString() === date.toDateString())
      setSelectedDate(t("GoalGetter.ShapeGoalScreen.monthAndYear"));
    else {
      const newDate = I18nManager.isRTL
        ? format(date, "dd MMMM yyyy", { locale: arLocale })
        : format(date, "dd MMMM yyyy");
      setSelectedDate(newDate);
    }
  };

  const primaryButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "flex-end",
    paddingHorizontal: theme.spacing["20p"],
  }));

  const headerScrollStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingTop: theme.spacing["24p"],
    gap: theme.spacing["32p"],
    flex: 1,
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
    <Page backgroundColor="neutralBase-60" testID="GoalGetter.ContributionScreen:Page">
      <CustomStatusBar backgroundColor="transparent" barStyle="dark-content" />
      <NavHeader
        testID="GoalGetter.ContributionScreen:NavHeader"
        title={t("GoalGetter.ShapeGoalScreen.title")}
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}>
        <View style={styles.progressIndicator}>
          <ProgressIndicator currentStep={3} totalStep={5} />
        </View>
      </NavHeader>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.containerFlex}
        testID="GoalGetter.ContributionScreen:KeyboardAvoidingView">
        <ScrollView style={headerScrollStyle}>
          <Stack direction="vertical" gap="8p">
            <Typography.Text color="primaryBase" size="title1" weight="bold">
              {t("GoalGetter.ShapeYourGoalContributions.title")}
            </Typography.Text>
            <Typography.Text style={subTitleMarginBottom}>
              {t("GoalGetter.ShapeYourGoalContributions.subTitle")}
            </Typography.Text>
          </Stack>

          <Stack direction="vertical" gap="12p" style={stackAmountStyle}>
            <Typography.Text>{t("GoalGetter.ShapeYourGoalContributions.initialContribution")}</Typography.Text>
            <View style={styles.containerInputStyle}>
              <CurrencyInput
                name="InitialContribution"
                control={control}
                currency={t("GoalGetter.ShapeGoalScreen.currency")}
                label=""
                testID="GoalGetter.ContributionScreen:CurrencyInput1"
              />
            </View>
          </Stack>
          <Stack direction="vertical" gap="12p" style={stackAmountStyle}>
            <Typography.Text>{t("GoalGetter.ShapeYourGoalContributions.recurringContribution")}</Typography.Text>
            <View style={styles.containerInputStyle}>
              <CurrencyInput
                name="RecurringFrequency"
                control={control}
                currency={t("GoalGetter.ShapeGoalScreen.currency")}
                label=""
                testID="GoalGetter.ContributionScreen:CurrencyInput2"
              />
            </View>
          </Stack>
          <Stack direction="vertical" gap="12p" style={stackAmountStyle}>
            <Typography.Text>{t("GoalGetter.ShapeYourGoalContributions.recurringFrequency")}</Typography.Text>
            <Pressable
              testID="GoalGetter.ContributionScreen:Pressable"
              style={recurringFrequencyModalStyle}
              onPress={() => setIsVisible(true)}>
              <Typography.Text color={recurringFrequencyValue ? "neutralBase+30" : "neutralBase"}>
                {recurringFrequencyValue
                  ? RECURRING_FREQUENCIES.find(portfolio => portfolio.PortfolioId === recurringFrequencyValue)
                      ?.PortfolioName
                  : t("GoalGetter.ShapeYourGoalContributions.selectFrequency")}
              </Typography.Text>
            </Pressable>
          </Stack>
          <RecurringFrequencyModal
            isVisible={isVisible}
            selected={recurringFrequencyValue}
            list={RECURRING_FREQUENCIES}
            onClose={handleOnCloseRecurringFrequencyModal}
            onSelect={handleSelectRecurringFrequencyValue}
          />
          {recurringFrequencyValue === "001" ? (
            <>
              <Typography.Text>{t("GoalGetter.ShapeYourGoalContributions.recurringDay")}</Typography.Text>
              <CalendarButton selectedDate={selectedDate} onClick={() => setDaysCalenderIsVisible(true)} />
              <CalenderDayModal
                onDateSelected={handleOnSelectDate}
                onClose={() => setDaysCalenderIsVisible(false)}
                isVisible={daysCalenderIsVisible}
                currentDate={selectedDate}
              />
            </>
          ) : (
            <>
              <Typography.Text style={recurringMarginBottom}>
                {t("GoalGetter.ShapeYourGoalContributions.recurringDay")}
              </Typography.Text>
              <BottomSheetModal
                buttonLabel={t("Settings.FinancialInformation.selectButton")}
                options={WORKING_WEEK_DAYS}
                onChange={handleValueChange}
                value={selectedValue}
                label={t("GoalGetter.ShapeYourGoalContributions.selectDay")}
                testID="GoalGetter.ContributionScreen:BottomSheetModal"
              />
            </>
          )}
        </ScrollView>

        <View style={primaryButtonStyle}>
          <Button disabled={!handleValidation()} onPress={handleSubmit(handleOnSubmit)}>
            {t("GoalGetter.ShapeYourGoalContributions.continue")}
          </Button>
        </View>
        <View style={primaryButtonStyle}>
          <Button onPress={handleOnSkip} variant="tertiary">
            {t("GoalGetter.ShapeYourGoalContributions.skipNow")}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerFlex: { flex: 1 },
  containerInputStyle: { width: "100%" },

  progressIndicator: { alignSelf: "center", width: "100%" },
});
