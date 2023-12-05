import { yupResolver } from "@hookform/resolvers/yup";
import format from "date-fns/format";
import arLocale from "date-fns/locale/ar";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { I18nManager } from "react-native";
import { StyleSheet, View, ViewStyle } from "react-native";
import * as yup from "yup";

import { ProgressIndicator, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import CustomStatusBar from "@/components/CustomStatusBar/CustomStatusBar";
import DateRangePicker from "@/components/DateRangePicker";
import CurrencyInput from "@/components/Form/CurrencyInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Pill from "@/components/Pill";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CalendarButton } from "../components";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { useGoalsSetting } from "../hooks/query-hooks";

interface GoalAmount {
  TargetAmount: number;
  MonthlyAmount: number;
}

export default function ShapeGoalScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setGoalContextState } = useGoalGetterContext();

  const [selectedGoalDurationOption, setSelectedGoalDurationOption] = useState<number | null>();
  const [isSelectedOption, setIsSelectedOption] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { data } = useGoalsSetting();

  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const goalDurationOptions = [
    t("GoalGetter.ShapeGoalScreen.setDuration"),
    t("GoalGetter.ShapeGoalScreen.immediately"),
    t("GoalGetter.ShapeGoalScreen.unknown"),
  ];

  const validationAmountSchema = yup.object().shape({
    TargetAmount: yup
      .number()
      .nullable()
      .min(
        data?.MinimumTargetAmount,
        t("GoalGetter.ShapeGoalScreen.error.minTargetAmount", { value: data?.MinimumTargetAmount })
      )
      .max(
        data?.MaximumTargetAmount,
        t("GoalGetter.ShapeGoalScreen.error.maxTargetAmount", { value: data?.MaximumTargetAmount })
      ),
    MonthlyAmount: yup
      .number()
      .nullable()
      .min(
        data?.MinimumMonthlyAmount,
        t("GoalGetter.ShapeGoalScreen.error.minMonthlyAmount", { value: data?.MinimumMonthlyAmount })
      )
      .max(
        data?.MaximumMonthlyAmount,
        t("GoalGetter.ShapeGoalScreen.error.maxMonthlyAmount", { value: data?.MaximumMonthlyAmount })
      )
      .test("is-less-than-target", t("GoalGetter.ShapeGoalScreen.error.maxMonthlyAmountRange"), function (value) {
        const TargetAmount = getTargetAmountValue();
        if (TargetAmount === 0) {
          return true;
        }
        return value <= TargetAmount;
      }),
  });

  const {
    control,
    watch,
    formState: { errors },
    getValues,
  } = useForm<GoalAmount>({
    resolver: yupResolver(validationAmountSchema),
    mode: "onChange",
    defaultValues: { TargetAmount: 0, MonthlyAmount: 0 },
  });

  const watchedValues = watch();

  function getTargetAmountValue() {
    if (getValues?.()) {
      return getValues().TargetAmount;
    }
  }

  const isSubmitButtonEnabled = () => {
    const isTargetAmountValidOrEmpty = watchedValues.TargetAmount ? !errors.TargetAmount : true;
    const isMonthlyAmountValidOrEmpty = watchedValues.MonthlyAmount ? !errors.MonthlyAmount : true;

    const isOneFieldFilledCorrectly =
      (watchedValues.TargetAmount && !errors.TargetAmount) || (watchedValues.MonthlyAmount && !errors.MonthlyAmount);

    const isDateSelectedWithoutErrors =
      isSelectedOption &&
      isTargetAmountValidOrEmpty &&
      isMonthlyAmountValidOrEmpty &&
      !errors.TargetAmount &&
      !errors.MonthlyAmount;

    return (
      (isTargetAmountValidOrEmpty && isMonthlyAmountValidOrEmpty && isOneFieldFilledCorrectly) ||
      isDateSelectedWithoutErrors
    );
  };

  useEffect(() => {
    if (selectedGoalDurationOption === 0) setSelectedDate(format(new Date(), "yyyy-MM-dd"));
  }, [selectedGoalDurationOption]);

  const handleDurationPress = (value: number) => {
    if (value === selectedGoalDurationOption) {
      setSelectedGoalDurationOption(null);
      setIsSelectedOption(false);
    } else {
      setSelectedGoalDurationOption(value);
      if (value !== 0) setIsSelectedOption(true);
      else setIsSelectedOption(false);
    }
  };

  const stackTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const stackAmountStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const stackBuyStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const handleOnSelectDate = (date: Date) => {
    setIsSelectedOption(true);
    const newDate = I18nManager.isRTL
      ? format(date, "dd MMMM yyyy", { locale: arLocale })
      : format(date, "dd MMMM yyyy");
    setSelectedDate(newDate);
  };

  const handleOnSubmit = () => {
    if (selectedGoalDurationOption === 2) {
      setGoalContextState({
        TargetAmount: getValues().TargetAmount,
        MonthlyContribution: getValues().MonthlyAmount || 500,
        TargetDate: selectedDate,
      });
      navigation.navigate("GoalGetter.ShapeYourGoalScreen");
    }
    if (selectedGoalDurationOption === 1) {
      // TODO: navigate to Emkan Screen another feature
      navigation.navigate("GoalGetter.EmkanTempScreen");
    }
    if (!selectedGoalDurationOption) {
      setGoalContextState({
        TargetAmount: getValues().TargetAmount,
        MonthlyContribution: getValues().MonthlyAmount,
        TargetDate: selectedDate,
      });
      navigation.navigate("GoalGetter.ShapeYourGoalScreen");
    }
  };

  const handleDurationSelect = (durationItem: { text: string; value: number }) => {
    // You can now use durationItem as needed, for example:
    // setSomeState(durationItem.value);
    setGoalContextState({ Duration: durationItem.text });
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={t("GoalGetter.ShapeGoalScreen.title")}
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}>
        <ProgressIndicator currentStep={1} totalStep={5} />
      </NavHeader>
      <CustomStatusBar backgroundColor="transparent" barStyle="dark-content" />
      <ContentContainer isScrollView>
        <Stack direction="vertical" gap="8p" style={stackTitleStyle}>
          <Typography.Text color="neutralBase+30" size="title1" weight="bold">
            {t("GoalGetter.ShapeGoalScreen.buildGoal")}
          </Typography.Text>
          <Typography.Text color="neutralBase+30" size="callout" weight="regular">
            {t("GoalGetter.ShapeGoalScreen.hint")}
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" gap="12p" style={stackAmountStyle}>
          <Typography.Text color="primaryBase" size="title3" weight="medium">
            {t("GoalGetter.ShapeGoalScreen.targetAmount")}
          </Typography.Text>
          <View style={styles.containerInputStyle}>
            <CurrencyInput
              name="TargetAmount"
              control={control}
              currency={t("GoalGetter.ShapeGoalScreen.currency")}
              label=""
            />
          </View>
        </Stack>
        <Stack direction="vertical" gap="12p" style={stackBuyStyle}>
          <Typography.Text color="primaryBase" size="title3" weight="medium">
            {t("GoalGetter.ShapeGoalScreen.durationNeeded")}
          </Typography.Text>
          <Stack direction="horizontal" gap="12p" justify="space-between" style={styles.stackPillStyle}>
            {goalDurationOptions.map((goalDutationOption, index) => {
              return (
                <Pill
                  key={index}
                  isActive={selectedGoalDurationOption === index}
                  onPress={() => handleDurationPress(index)}>
                  {goalDutationOption}
                </Pill>
              );
            })}
          </Stack>
        </Stack>
        {selectedGoalDurationOption === 0 ? (
          <CalendarButton selectedDate={selectedDate} onClick={() => setIsVisible(true)} />
        ) : null}
        <Stack direction="vertical" gap="16p">
          <Typography.Text color="neutralBase+30" size="title3" weight="medium">
            {t("GoalGetter.ShapeGoalScreen.monthlyContribution")}
          </Typography.Text>
          <View style={styles.containerInputStyle}>
            <CurrencyInput
              name="MonthlyAmount"
              control={control}
              currency={t("GoalGetter.ShapeGoalScreen.currency")}
              label=""
            />
          </View>
        </Stack>
        <View style={{ marginTop: 200 }}>
          <Button disabled={!isSubmitButtonEnabled()} onPress={handleOnSubmit}>
            {t("GoalGetter.ShapeGoalScreen.continueButton")}
          </Button>
        </View>
      </ContentContainer>
      <DateRangePicker
        isVisible={isVisible}
        onDateSelected={handleOnSelectDate}
        currentDate={selectedDate}
        onClose={() => setIsVisible(false)}
        onDurationSelect={handleDurationSelect}
        withDuration={true}
        minimumDuration={data?.MinimumDuration}
        maximumDuration={data?.MaximumDuration}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  containerInputStyle: { width: "100%" },
  stackPillStyle: { width: "100%" },
});
