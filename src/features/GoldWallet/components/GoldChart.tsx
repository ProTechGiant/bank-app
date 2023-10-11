import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import { CurveType, LineChart } from "react-native-gifted-charts";

import SegmentedControl from "@/components/SegmentedControl";
import { useThemeStyles } from "@/theme";

import { chartMockData } from "../mock";
import { TabsTypes } from "../types";

export default function GoldChart() {
  const [currentTab, setCurrentTab] = useState<TabsTypes>(TabsTypes.Week);
  const { t } = useTranslation();

  const chartContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    borderStyle: "solid",
    borderWidth: 1,
    justifyContent: "center",
    padding: theme.spacing["12p"],
    paddingBottom: theme.spacing["32p"],
    width: "100%",
    overflow: "hidden",
  }));

  const yAxisTextStyle = useThemeStyles<ViewStyle>(theme => ({
    color: theme.palette.neutralBase,
    fontSize: theme.typography.text.sizes.caption2,
    marginEnd: theme.spacing["4p"],
  }));

  const tabsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const chartBackgroundColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);
  const chartLineColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  return (
    <View>
      <View style={tabsContainerStyle}>
        <SegmentedControl
          onPress={item => {
            setCurrentTab(item);
          }}
          value={currentTab}>
          <SegmentedControl.Item value="Week" fontWeight="regular">
            {t("GoldWallet.week")}
          </SegmentedControl.Item>
          <SegmentedControl.Item value="Month" fontWeight="regular">
            {t("GoldWallet.month")}
          </SegmentedControl.Item>
          <SegmentedControl.Item value="Year" fontWeight="regular">
            {t("GoldWallet.year")}
          </SegmentedControl.Item>
          <SegmentedControl.Item value="5Year" fontWeight="regular">
            {t("GoldWallet.fiveYears")}
          </SegmentedControl.Item>
        </SegmentedControl>
      </View>
      <View style={chartContainerStyle}>
        <LineChart
          yAxisLabelSuffix=" SAR "
          isAnimated
          thickness={4}
          xAxisColor="lightgray"
          rulesColor="lightgray"
          color1={chartLineColor}
          maxValue={600}
          yAxisThickness={0}
          noOfSections={6}
          animateOnDataChange
          animationDuration={1000}
          onDataChangeAnimationDuration={300}
          areaChart
          yAxisLabelWidth={50}
          yAxisTextStyle={yAxisTextStyle}
          data={chartMockData}
          startFillColor1={chartBackgroundColor}
          endFillColor1={chartBackgroundColor}
          startOpacity={0.4}
          endOpacity={0.1}
          backgroundColor={chartBackgroundColor}
          rulesType="solid"
          focusEnabled={true}
          curved
          curveType={CurveType.CUBIC}
          showTextOnFocus={true}
          showDataPointOnFocus={true}
          delayBeforeUnFocus={300}
          // hideRules
          unFocusOnPressOut={true}
        />
      </View>
    </View>
  );
}
