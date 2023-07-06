import { t } from "i18next";
import React from "react";
import { I18nManager, View, ViewStyle } from "react-native";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup } from "victory-native";

import { useThemeStyles } from "@/theme";

import { DAILY_INTERVAL, MONTHLY_INTERVAL, WEEKLY_INTERVAL, YEARLY_INTERVAL } from "../constants";
import { ChartTypes } from "../enum";
import { ChartDataType } from "../types";

interface ChartProps {
  data: ChartDataType[];
  type: ChartTypes;
}
export default function Chart({ data, type }: ChartProps) {
  const formatRightAxisTick = (tick: number) => `${tick} ${t("TopSpending.SpendSummaryScreen.sr")}`;

  let interval: number;
  switch (type) {
    case ChartTypes.MONTHLY:
      interval = MONTHLY_INTERVAL;
      break;
    case ChartTypes.DAILY:
      interval = DAILY_INTERVAL;
      break;
    case ChartTypes.WEEKLY:
      interval = WEEKLY_INTERVAL;
      break;
    case ChartTypes.YEARLY:
      interval = YEARLY_INTERVAL;
      break;
  }

  const averageNumbers = getAverage(data);
  const isRTL = I18nManager.isRTL;

  const padding = {
    left: isRTL ? 80 : 0,
    right: isRTL ? 60 : 120,
    top: 25,
    bottom: 30,
  };

  const container = useThemeStyles<ViewStyle>(theme => ({
    display: "flex",
    justifyContent: "center",
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const bottomVictoryAxisStyle = useThemeStyles(theme => ({
    fontSize: theme.typography.text.sizes.caption2,
    fill: "#7D7D7D", // TODO: We'll update it once added in theme
    fontWeight: theme.typography.text.weights.medium,
  }));

  const rightVictoryAxisStyle = useThemeStyles(theme => ({
    fontSize: theme.typography.text.sizes.caption2,
    fill: "#7D7D7D", // TODO: We'll update it once added in theme
    fontWeight: theme.typography.text.weights.medium,
  }));

  const neutralBaseColor = useThemeStyles(theme => theme.palette["neutralBase-40"]);
  const primaryBaseColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);
  const complimentBaseColor = useThemeStyles(theme => theme.palette.complimentBase);
  const chartHeight = 143;

  return (
    <View style={container}>
      <VictoryChart height={chartHeight} padding={padding}>
        <VictoryAxis
          tickValues={data.map(item => item.category)}
          style={{
            axis: { stroke: "none" },
            tickLabels: bottomVictoryAxisStyle,
          }}
        />
        <VictoryAxis
          dependentAxis
          orientation="right"
          tickValues={averageNumbers}
          tickCount={5}
          style={{
            tickLabels: rightVictoryAxisStyle,
            axis: { stroke: "none" },
            grid: { stroke: neutralBaseColor, strokeWidth: 1 },
          }}
          tickFormat={formatRightAxisTick}
        />
        <VictoryGroup offset={interval}>
          <VictoryBar
            data={data}
            x="category"
            y="series1"
            cornerRadius={2}
            style={{ data: { fill: primaryBaseColor } }}
          />
          <VictoryBar
            cornerRadius={2}
            data={data}
            x="category"
            y="series2"
            style={{ data: { fill: complimentBaseColor } }}
          />
        </VictoryGroup>
      </VictoryChart>
    </View>
  );
}

const getAverage = (data: ChartDataType[]): number[] => {
  if (data.length) {
    const max = Math.max(...data.map(({ series1, series2 }) => Math.max(series1, series2)));
    const min = Math.min(...data.map(({ series1, series2 }) => Math.min(series1, series2)));

    const array = [];
    for (let i = 0; i < 5; i++) {
      const average = Math.round((min + (max - min) * (i / 4)) / 10) * 10;
      array.push(average);
    }
    return array;
  } else {
    return [0, 10, 20, 30, 40];
  }
};
