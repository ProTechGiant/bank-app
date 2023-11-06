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

import { AngleDownIcon } from "@/assets/icons";
import { Stack } from "@/components";
import Button from "@/components/Button";
import CurrencyInput from "@/components/Form/CurrencyInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import {
  BottomSheetModal,
  CalendarButton,
  CalenderDayModalModal,
  ContributionMethodModal,
  RecurringFrequencyModal,
} from "../components";
import { mockSettings } from "../mocks/mockContribution";

interface GoalAmount {
  selectedDay: string;
  InitialContribution: number;
  RecurringFrequency: number;
  PercentageInput: number;
}

export default function ContributionSavingPotScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [contributionMethodsIsVisible, setContributionMethodsIsVisible] = useState<boolean>(false);

  const [daysCalenderIsVisible, setDaysCalenderIsVisible] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [methodsContribution, setMethodsContribution] = useState<string>("");
  const [recurringFrequencyValue, setRecurringFrequencyValue] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const recurringContribution = [
    {
      PortfolioId: "002",
      PortfolioName: t("GoalGetter.ShapeYourGoalContributions.Weekly"),
    },
    {
      PortfolioId: "001",
      PortfolioName: t("GoalGetter.ShapeYourGoalContributions.Monthly"),
    },
  ];

  const daysWeek = [
    {
      label: t("GoalGetter.ShapeYourGoalContributions.Sunday"),
      value: "sunday",
    },
    {
      label: t("GoalGetter.ShapeYourGoalContributions.Monday"),
      value: "monday",
    },
    {
      label: t("GoalGetter.ShapeYourGoalContributions.Tuesday"),
      value: "tuesday",
    },
    {
      label: t("GoalGetter.ShapeYourGoalContributions.Wednesday"),
      value: "wednesday",
    },
    {
      label: t("GoalGetter.ShapeYourGoalContributions.Thursday"),
      value: "thursday",
    },
  ];

  const validationAmountSchema = yup.object().shape({
    InitialContribution: yup.number(),
    RecurringFrequency: yup.number(),
    PercentageInput: yup
      .number()
      .nullable()
      .min(mockSettings.MinPercentageInput, t("GoalGetter.ShapeYourGoalContributions.error.min"))
      .max(mockSettings.MaxPercentageInput, t("GoalGetter.ShapeYourGoalContributions.error.max")),
  });

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
  };

  const { control, formState, handleSubmit } = useForm<GoalAmount>({
    resolver: yupResolver(validationAmountSchema),
    mode: "onBlur",
    defaultValues: { InitialContribution: 150, RecurringFrequency: 1000, PercentageInput: 0 },
  });

  const handleOnSubmit = () => {
    // TODO: add navigation when another screen is ready
  };

  const handleOnSkip = () => {
    // TODO: add navigation when another screen is ready
  };

  const handleSelectRecurringFrequencyValue = (value: string | null) => {
    if (value !== null) {
      setRecurringFrequencyValue(value);
    }
  };

  const handleValidation = () => {
    return !(
      formState.errors?.InitialContribution ||
      formState.errors?.RecurringFrequency ||
      formState.errors?.PercentageInput
    );
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
    paddingBottom: theme.spacing["20p"],
    justifyContent: "flex-end",
    paddingHorizontal: theme.spacing["20p"],
  }));

  const headerScrollStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    flex: 1,
    marginBottom: theme.spacing["12p"],
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

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={t("GoalGetter.ShapeGoalScreen.title")}
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}>
        <View style={styles.progressIndicator}>
          <ProgressIndicator currentStep={3} totalStep={5} />
        </View>
      </NavHeader>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.containerFlex}>
        <ScrollView style={headerScrollStyle}>
          <Stack direction="vertical" gap="12p" style={stackAmountStyle}>
            <Typography.Text>{t("GoalGetter.ShapeYourGoalContributions.contributionMethod")}</Typography.Text>
            <Pressable style={recurringFrequencyModalStyle} onPress={() => setContributionMethodsIsVisible(true)}>
              <Typography.Text>
                {methodsContribution.length > 0
                  ? methodsContribution.join(", ")
                  : t("GoalGetter.ShapeYourGoalContributions.selectMethods")}
              </Typography.Text>
              <AngleDownIcon />
            </Pressable>
          </Stack>
          {methodsContribution.includes("percentage") ? (
            <Stack direction="vertical" gap="12p" style={stackAmountStyle}>
              <Typography.Text>{t("GoalGetter.ShapeYourGoalContributions.Percentage")}</Typography.Text>
              <View style={styles.containerInputStyle}>
                <CurrencyInput name="PercentageInput" control={control} label="" currency="%" />
              </View>
            </Stack>
          ) : null}

          <Stack direction="vertical" gap="12p" style={stackAmountStyle}>
            <Typography.Text>{t("GoalGetter.ShapeYourGoalContributions.initialContribution")}</Typography.Text>
            <View style={styles.containerInputStyle}>
              <CurrencyInput
                name="InitialContribution"
                control={control}
                currency={t("GoalGetter.ShapeGoalScreen.currency")}
                label=""
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
              />
            </View>
          </Stack>
          <Stack direction="vertical" gap="12p" style={stackAmountStyle}>
            <Typography.Text>{t("GoalGetter.ShapeYourGoalContributions.recurringContribution")}</Typography.Text>
            <Pressable style={recurringFrequencyModalStyle} onPress={() => setIsVisible(true)}>
              <Typography.Text>
                {recurringFrequencyValue
                  ? recurringContribution.find(portfolio => portfolio.PortfolioId === recurringFrequencyValue)
                      ?.PortfolioName
                  : t("GoalGetter.ShapeYourGoalContributions.selectFrequency")}
              </Typography.Text>
            </Pressable>
          </Stack>
          <RecurringFrequencyModal
            isVisible={isVisible}
            selected={recurringFrequencyValue}
            list={recurringContribution}
            onClose={handleOnCloseRecurringFrequencyModal}
            onSelect={handleSelectRecurringFrequencyValue}
          />
          {recurringFrequencyValue === "001" ? (
            <>
              <Typography.Text>{t("GoalGetter.ShapeYourGoalContributions.recurringDay")}</Typography.Text>
              <CalendarButton selectedDate={selectedDate} onClick={() => setDaysCalenderIsVisible(true)} />
              <CalenderDayModalModal
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
                options={daysWeek}
                onChange={handleValueChange}
                value={selectedValue}
                label={t("GoalGetter.ShapeYourGoalContributions.selectDay")}
              />
            </>
          )}
          <ContributionMethodModal
            onClose={() => setContributionMethodsIsVisible(false)}
            isVisible={contributionMethodsIsVisible}
            onValueChange={(value: string) => {
              setMethodsContribution(value);
            }}
          />
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
