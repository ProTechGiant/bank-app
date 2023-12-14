import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { CurveType, LineChart } from "react-native-gifted-charts";

import SegmentedControl from "@/components/SegmentedControl";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { FundPerformanceType, TabsFundTypes } from "../types";

interface FundChartProps {
  updateFundChartType: (data: TabsFundTypes) => void;
  data?: FundPerformanceType[];
}

export default function FundChart({ updateFundChartType, data }: FundChartProps) {
  const [currentTab, setCurrentTab] = useState<TabsFundTypes>(TabsFundTypes.DAY);
  const [list, setList] = useState<FundPerformanceType[]>([]);
  const { t } = useTranslation();

  const customizedList = (listData: any) => {
    return listData.map((item, index) => ({
      value: item.UnRealizedGainLoss,
      label: item.date,
      labelWidth: 70,
      showLabel:
        currentTab === TabsFundTypes.DAY
          ? true
          : currentTab === TabsFundTypes.MONTH && new Date(item.Date).getDate() === 1
          ? true
          : currentTab === TabsFundTypes.WEEK && index % 7 === 0
          ? true
          : currentTab === TabsFundTypes.THREE_MONTHS && index % 13 === 0
          ? true
          : false,
      focusedCustomDataPoint: createFocusedCustomDataPoint(item.Date, item.MarketValue),
    }));
  };

  useEffect(() => {
    if (data) {
      const updatedData = customizedList(data);
      setList(updatedData);
    }
  }, [currentTab, data]);

  function createFocusedCustomDataPoint(label: string, value: number) {
    return () => {
      return (
        <View style={styles.tooltipContainer}>
          <View style={focusedPointConstrainerStyle}>
            <View style={focusedPointStyle} />
          </View>
          <View style={tooltipContainerStyle}>
            <Typography.Text color="neutralBase-60" size="caption2" align="center">
              {label} : {value.toFixed(2)} {t("GoldWallet.SARG")}
            </Typography.Text>
          </View>
        </View>
      );
    };
  }
  const chartContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: "transparent",
    borderRadius: theme.radii.small,
    borderStyle: "solid",
    borderWidth: 1,
    justifyContent: "center",
    padding: theme.spacing["8p"],
    paddingBottom: theme.spacing["32p"],
    width: "100%",
    overflow: "scroll",
  }));

  const focusedPointConstrainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: 12,
    height: 12,
    backgroundColor: theme.palette["neutralBase-60"],
    borderWidth: 1,
    borderRadius: theme.radii.small,
    borderColor: theme.palette["neutralBase-60"],
    marginBottom: theme.spacing["4p"],
    justifyContent: "center",
    alignItems: "center",
  }));

  const focusedPointStyle = useThemeStyles<ViewStyle>(theme => ({
    width: 6,
    height: 6,
    backgroundColor: "#D73798", // TODO doesnot exist in the theme
    borderWidth: 1,
    borderRadius: theme.radii.extraSmall,
    borderColor: "#D73798", // TODO doesnot exist in the theme
  }));

  const tooltipContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 28,
    backgroundColor: "#D73798", // TODO doesnot exist in the theme
    borderRadius: theme.radii.extraSmall,
    position: "absolute",
    bottom: 25,
    left: 0,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
  }));

  const yAxisTextStyle = useThemeStyles<ViewStyle>(theme => ({
    color: theme.palette.neutralBase,
    fontSize: theme.typography.text.sizes.caption2,
    marginEnd: theme.spacing["4p"],
  }));

  const tabsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
    width: "100%",
  }));

  const chartBackgroundColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);

  const segmentedControlStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.xxlarge,
    backgroundColor: theme.palette["neutralBase-40"],
    justifyContent: "space-around",
    alignItems: "center",
  }));

  return (
    <View>
      <View style={tabsContainerStyle}>
        <SegmentedControl
          onPress={item => {
            updateFundChartType(item);
            setCurrentTab(item);
          }}
          value={currentTab}
          style={segmentedControlStyle}>
          <SegmentedControl.Item value={TabsFundTypes.DAY} fontWeight="regular" withUnderline={false}>
            {t("GoalGetter.GoalSetupLineChartModal.lineChart.day")}
          </SegmentedControl.Item>
          <SegmentedControl.Item value={TabsFundTypes.WEEK} fontWeight="regular" withUnderline={false}>
            {t("GoalGetter.GoalSetupLineChartModal.lineChart.week")}
          </SegmentedControl.Item>
          <SegmentedControl.Item value={TabsFundTypes.MONTH} fontWeight="regular" withUnderline={false}>
            {t("GoalGetter.GoalSetupLineChartModal.lineChart.month")}
          </SegmentedControl.Item>
          <SegmentedControl.Item value={TabsFundTypes.THREE_MONTHS} fontWeight="regular" withUnderline={false}>
            {t("GoalGetter.GoalSetupLineChartModal.lineChart.threeMonths")}
          </SegmentedControl.Item>
        </SegmentedControl>
      </View>
      <View style={chartContainerStyle}>
        {list.length > 0 ? (
          <LineChart
            yAxisLabelSuffix=" SAR "
            thickness={2}
            spacing={42}
            xAxisColor="lightgray"
            rulesColor="lightgray"
            color1="#D73798" // TODO doesnot exist in the theme
            yAxisThickness={0}
            maxValue={300}
            noOfSections={6}
            areaChart
            yAxisLabelWidth={50}
            yAxisTextStyle={yAxisTextStyle}
            data={list}
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
            unFocusOnPressOut={true}
            showStripOnFocus={true}
            tooltipWidth={110}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tooltipContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
});
