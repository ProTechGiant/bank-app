import Slider from "@react-native-community/slider";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View, ViewStyle } from "react-native";

import { Typography } from "@/components";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import { useThemeStyles } from "@/theme";

import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { useGoalsSetting } from "../hooks/query-hooks";
import { GoalGetterProduct } from "../types";
import { validateFormValue } from "../utils";
import PerformanceChart from "./PerformanceChart";

export interface SliderProgressBarProps {
  productList?: GoalGetterProduct[];
}

export default function SliderProgressBar({ productList }: SliderProgressBarProps) {
  const { t } = useTranslation();
  const { data } = useGoalsSetting();

  const { TargetAmount, MonthlyContribution, ValidCalculation, setGoalContextState } = useGoalGetterContext();

  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSliderValue(Number(MonthlyContribution));
    }, 100);
    return () => clearTimeout(timer);
  }, [MonthlyContribution]);

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    setGoalContextState({
      MonthlyContribution: value,
      Duration: Math.ceil(TargetAmount / value),
    });
  };

  const handleTextInputChange = (value: string) => {
    const inputValue = validateFormValue(value);
    setSliderValue(Number(inputValue ?? 0));
    setGoalContextState({
      MonthlyContribution: Number(inputValue),
      Duration: Math.ceil(TargetAmount / Number(value)),
    });
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    padding: theme.spacing["20p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    marginTop: theme.spacing["12p"],
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const textInputContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    backgroundColor: "#F9DE86", // TODO does not exist in the theme
    borderWidth: 1,
    paddingHorizontal: theme.spacing["12p"],
    borderRadius: theme.spacing["8p"],
    borderColor: theme.palette["supportBase-10"],
    alignItems: "center",
    height: 29,
  }));

  const sliderContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["24p"],
  }));

  const rowBetweenStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: theme.spacing["12p"],
  }));

  const progressBarColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <View style={containerStyle}>
      <View style={rowBetweenStyle}>
        <Typography.Text size="title3" weight="bold">
          {t("GoalGetter.ShapeYourGoalScreen.monthlyContributions")}
        </Typography.Text>
        <View style={textInputContainerStyle}>
          <View>
            <TextInput
              style={styles.textInputStyle}
              value={MonthlyContribution?.toString()}
              onChangeText={handleTextInputChange}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
          <Typography.Text size="footnote" weight="bold">
            {" "}
            {t("MutualFund.MutualFundDetailsScreen.ProgressBar.currency")}
          </Typography.Text>
        </View>
      </View>
      <View style={sliderContainerStyle}>
        <Slider
          minimumValue={data?.MinimumMonthlyAmount}
          maximumValue={TargetAmount}
          value={sliderValue}
          step={100}
          onValueChange={handleSliderChange}
          maximumTrackTintColor="#E8E8E9" // TODO does not exist in the theme
          minimumTrackTintColor={progressBarColor}
          thumbTintColor={progressBarColor}
        />
      </View>
      {!ValidCalculation ? (
        <View>
          <Typography.Text size="caption1">{t("GoalGetter.ShapeYourGoalScreen.tailoredDuration")}</Typography.Text>
        </View>
      ) : null}
      <View style={contentContainerStyle}>
        <View>
          <Typography.Text size="title3" weight="bold">
            {t("GoalGetter.ShapeYourGoalScreen.productPerformance")}
          </Typography.Text>
        </View>
        {/* TODO: These values will be changed when the API is ready */}
        {true ? (
          <PerformanceChart investmentAmount={sliderValue} productList={productList} />
        ) : (
          <FlexActivityIndicator />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textInputStyle: { flex: 1, height: 40, padding: 0 },
});
