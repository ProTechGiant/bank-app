import Slider from "@react-native-community/slider";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View, ViewStyle } from "react-native";

import { Typography } from "@/components";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import { useThemeStyles } from "@/theme";

import { GoalGetterProduct } from "../types";
import PerformanceChart from "./PerformanceChart";

export interface SliderProgressBarProps {
  productList: GoalGetterProduct[];
}

export default function SliderProgressBar({ productList }: SliderProgressBarProps) {
  const { t } = useTranslation();

  const [sliderValue, setSliderValue] = useState(0);
  const [textInputValue, setTextInputValue] = useState("500");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSliderValue(500);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    setTextInputValue(value.toString());
  };

  const handleTextInputChange = (value: string) => {
    setSliderValue(value === "" ? 0 : parseFloat(value));
    setTextInputValue(value);
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
    backgroundColor: theme.palette["supportBase-10"],
    borderWidth: 1,
    paddingHorizontal: theme.spacing["12p"],
    borderRadius: theme.spacing["8p"],
    borderColor: theme.palette["supportBase-10"],
    alignItems: "center",
    height: 29,
  }));

  const rowBetweenStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: theme.spacing["12p"],
  }));

  const titleBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    paddingBottom: 0,
  }));

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
              value={textInputValue}
              onChangeText={handleTextInputChange}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
          <Typography.Text size="footnote" weight="bold">
            {t("MutualFund.MutualFundDetailsScreen.ProgressBar.currency")}
          </Typography.Text>
        </View>
      </View>
      <View style={{ marginVertical: 24 }}>
        <Slider
          minimumValue={0}
          maximumValue={6000}
          value={sliderValue}
          step={500}
          onValueChange={handleSliderChange}
          maximumTrackTintColor="#d3d3d3"
          minimumTrackTintColor="#FF4500"
          thumbTintColor="#FF4500"
        />
      </View>

      <View style={contentContainerStyle}>
        <View style={titleBoxStyle}>
          <Typography.Text size="title3" weight="bold">
            {t("GoalGetter.ShapeYourGoalScreen.productPerformance")}
          </Typography.Text>
        </View>
        {productList ? (
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
