import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { CurveType, LineChart } from "react-native-gifted-charts";

import SegmentedControl from "@/components/SegmentedControl";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { GoldPerformanceDailyType, GoldPerformanceMonthlyType, TabsTypes } from "@/types/GoldChart";

interface GoldLineChartProps {
  updateChartType: (data: keyof TabsTypes) => void;
  data?: GoldPerformanceMonthlyType[] | GoldPerformanceDailyType[];
  hasFiveYears: boolean;
}

export default function GoldLineChart({ updateChartType, data, hasFiveYears = true }: GoldLineChartProps) {
  const [currentTab, setCurrentTab] = useState<TabsTypes>(TabsTypes.Week);
  const [list, setList] = useState<GoldPerformanceMonthlyType[] | GoldPerformanceDailyType[]>([]);
  const { t } = useTranslation();

  const customizedList = (listData: any) => {
    return listData.map((item, index) => ({
      value: currentTab === TabsTypes.FiveYears ? item.Performance : item.SellPrice,
      label:
        currentTab === TabsTypes.FiveYears
          ? item.Month.split(" ")[1]
          : currentTab === TabsTypes.Year
          ? item.Month
          : currentTab === TabsTypes.Month
          ? `Week ${index < 7 ? 1 : index < 14 ? 2 : index < 21 ? 3 : index < 28 ? 4 : 5}`
          : item.Day,
      labelWidth: currentTab === TabsTypes.FiveYears ? 40 : currentTab === TabsTypes.Month ? 50 : 30,
      showLabel:
        currentTab === TabsTypes.Month && index % 7 === 0
          ? true
          : currentTab === TabsTypes.Year && new Date(item.Date).getDate() === 1
          ? true
          : currentTab === TabsTypes.FiveYears && index % 12 === 0
          ? true
          : currentTab === TabsTypes.Week
          ? true
          : false,
      focusedCustomDataPoint:
        currentTab === TabsTypes.FiveYears
          ? createFocusedCustomDataPoint(item.Month.split(" ")[0], item.Performance)
          : currentTab === TabsTypes.Year
          ? createFocusedCustomDataPoint(item.Date, item.SellPrice)
          : createFocusedCustomDataPoint(item.Day, item.SellPrice),
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
    backgroundColor: theme.palette["primaryBase-40"],
    borderWidth: 1,
    borderRadius: theme.radii.extraSmall,
    borderColor: theme.palette["primaryBase-40"],
  }));

  const tooltipContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 28,
    backgroundColor: theme.palette["neutralBase+30"],
    borderRadius: 5,
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
  }));

  const chartBackgroundColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);
  const chartLineColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  return (
    <View>
      <View style={tabsContainerStyle}>
        <SegmentedControl
          onPress={item => {
            updateChartType(item);
            setCurrentTab(item);
          }}
          value={currentTab}>
          <SegmentedControl.Item value="Week" fontWeight="regular">
            {t("GoalGetter.GoalSetupLineChartModal.lineChart.week")}
          </SegmentedControl.Item>
          <SegmentedControl.Item value="Month" fontWeight="regular">
            {t("GoalGetter.GoalSetupLineChartModal.lineChart.month")}
          </SegmentedControl.Item>
          <SegmentedControl.Item value="Year" fontWeight="regular">
            {t("GoalGetter.GoalSetupLineChartModal.lineChart.year")}
          </SegmentedControl.Item>
          {hasFiveYears ? (
            <SegmentedControl.Item value="5 Years" fontWeight="regular">
              {t("GoalGetter.GoalSetupLineChartModal.lineChart.fiveYears")}
            </SegmentedControl.Item>
          ) : null}
        </SegmentedControl>
      </View>
      <View style={chartContainerStyle}>
        {list.length > 0 ? (
          <LineChart
            yAxisLabelSuffix=" SAR "
            thickness={2}
            spacing={
              currentTab === TabsTypes.FiveYears
                ? 4
                : currentTab === TabsTypes.Year
                ? 2
                : currentTab === TabsTypes.Month
                ? 9
                : 42
            }
            xAxisColor="lightgray"
            rulesColor="lightgray"
            color1={chartLineColor}
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
