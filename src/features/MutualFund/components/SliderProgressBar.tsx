import Slider from "@react-native-community/slider";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, TextStyle, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import { useThemeStyles } from "@/theme";

import { InvestmentIcon } from "../assets/icons";
import { usePerformanceLast3Years } from "../hooks/query-hooks";
import PerformanceChart from "./PerformanceChart";

export interface SliderProgressBarProps {
  productId: string;
}

export default function SliderProgressBar({ productId }: SliderProgressBarProps) {
  const { t } = useTranslation();
  const { data: performanceLastYears } = usePerformanceLast3Years(productId);

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
    marginTop: theme.spacing["16p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    borderColor: "lightgray",
    borderWidth: 0.5,
    marginTop: theme.spacing["12p"],
    padding: theme.spacing["16p"],
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

  const textStyle = useThemeStyles<TextStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <View style={containerStyle}>
      <Stack direction="horizontal" gap="8p">
        <InvestmentIcon />
        <Typography.Text color="neutralBase+30" size="title3" weight="medium">
          {t("MutualFund.MutualFundDetailsScreen.expectedPerformance")}
        </Typography.Text>
      </Stack>
      <View style={contentContainerStyle}>
        <Typography.Text size="footnote" weight="medium" style={textStyle} color="neutralBase">
          {t("MutualFund.MutualFundDetailsScreen.ProgressBar.titleText")}
        </Typography.Text>
        {/* TODO: These values will be changed when the API is ready */}
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={6000}
          value={sliderValue}
          step={500}
          onValueChange={handleSliderChange}
          maximumTrackTintColor="#d3d3d3"
          minimumTrackTintColor="#FF4500"
          thumbTintColor="#FF4500"
        />
        <View style={rowBetweenStyle}>
          <Typography.Text size="footnote" weight="medium">
            {t("MutualFund.MutualFundDetailsScreen.ProgressBar.investmentAmount")}
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
        {performanceLastYears ? (
          <PerformanceChart investmentAmount={sliderValue} performance={performanceLastYears.Last3YearsPerformance} />
        ) : (
          <FlexActivityIndicator />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slider: {
    height: 20,
  },
  textInputStyle: { flex: 1, height: 40, padding: 0 },
});
