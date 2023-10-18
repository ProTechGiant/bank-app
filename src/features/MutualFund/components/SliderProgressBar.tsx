import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, TextStyle, View, ViewStyle } from "react-native";

import { Typography } from "@/components";
import { useThemeStyles } from "@/theme";

export default function SliderProgressBar() {
  const [sliderValue, setSliderValue] = useState(0);
  const [textInputValue, setTextInputValue] = useState("0");

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    setTextInputValue(value.toString());
  };

  const handleTextInputChange = (value: string) => {
    setSliderValue(parseFloat(value));
    setTextInputValue(value);
  };

  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["24p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    paddingLeft: 22,
    borderColor: "lightgray",
    borderWidth: 0.5,
    paddingRight: theme.spacing["12p"],
    marginVertical: theme.spacing["12p"],
    paddingVertical: theme.spacing["12p"],
  }));

  const textInputContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    backgroundColor: theme.palette["supportBase-10"],
    borderWidth: 1,
    paddingHorizontal: theme.spacing["12p"],
    borderRadius: theme.spacing["8p"],
    minWidth: 90,
    borderColor: theme.palette["supportBase-10"],
    alignItems: "center",
    height: 29,
  }));

  const rowBetweenStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: theme.spacing["12p"],
  }));

  const textStyle = useThemeStyles<TextStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <View style={containerStyle}>
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
            <TextInput
              style={styles.textInputStyle}
              value={textInputValue}
              onChangeText={handleTextInputChange}
              keyboardType="numeric"
              maxLength={5}
            />
            <Typography.Text size="footnote" weight="bold">
              {t("MutualFund.MutualFundDetailsScreen.ProgressBar.currency")}
            </Typography.Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slider: {
    height: 20,
    width: "90%",
  },
  textInputStyle: { flex: 1, height: 40, padding: 0 },
});
