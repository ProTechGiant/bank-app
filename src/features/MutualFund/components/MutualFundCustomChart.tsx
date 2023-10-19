import { format } from "date-fns";
import { useMemo } from "react";
import { View, ViewStyle } from "react-native";
import { VictoryAxis, VictoryChart, VictoryLine } from "victory-native";

import { useThemeStyles } from "@/theme";

import { usePortfoliosPerformanceList } from "../hooks/query-hooks";
import { LINES_COLORS } from "../mocks/chartLinesColors";
import { PortfolioPerformanceList } from "../types";

interface MutualFundCustomChartProps {
  tickLabelsColor: string;
  gridStrokeColor: string;
  chartBorderColor: string;
  chartBackgroundColor?: string;
  mutualFundCustomChartList?: PortfolioPerformanceList[];
  PortfolioPerformanceLineChartColorIndex?: number;
}

export default function MutualFundCustomChart({
  tickLabelsColor,
  gridStrokeColor,
  chartBorderColor,
  chartBackgroundColor,
  mutualFundCustomChartList,
  PortfolioPerformanceLineChartColorIndex,
}: MutualFundCustomChartProps) {
  const { data } = usePortfoliosPerformanceList();

  const chartViewStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderRadius: theme.radii.small,
      borderColor: chartBorderColor,
      borderWidth: 1,
      backgroundColor: chartBackgroundColor,
    }),
    [chartBackgroundColor, chartBorderColor]
  );

  const x_axis_labels = useMemo(() => {
    return data?.PortfoliosPerformanceList[0].PortfolioPerformanceList?.map(obj => format(new Date(obj.Date), "d MMM"));
  }, [data]);

  return mutualFundCustomChartList !== undefined ? (
    <View style={chartViewStyle}>
      <VictoryChart width={350} height={220} animate={{ duration: 1500 }}>
        <VictoryAxis
          style={{
            tickLabels: {
              fill: tickLabelsColor,
              fontSize: 12,
            },
          }}
          tickValues={x_axis_labels}
          standalone={false}
        />
        <VictoryAxis
          dependentAxis
          domain={[0, 30]}
          style={{
            grid: {
              stroke: gridStrokeColor,
              strokeWidth: 2,
            },
            axis: { stroke: "transparent" },
            tickLabels: {
              fill: tickLabelsColor,
            },
          }}
          tickValues={[0, 5, 10, 15, 20, 25, 30]}
          tickFormat={t => {
            if (t !== 0 && t % 10 === 0) {
              return `${t}k`;
            } else if (t === 0) return t;
          }}
          standalone={false}
        />
        {mutualFundCustomChartList.map((portfolio, index) => {
          return (
            <VictoryLine
              style={{
                data: {
                  stroke: `${
                    PortfolioPerformanceLineChartColorIndex !== undefined
                      ? LINES_COLORS[PortfolioPerformanceLineChartColorIndex]
                      : LINES_COLORS[index]
                  }`,
                  strokeWidth: 4.5,
                },
              }}
              // Converts date and market value format for compatibility reasons
              data={portfolio.PortfolioPerformanceList?.map(obj => {
                return { x: format(new Date(obj.Date), "d MMM"), y: parseInt(obj.MarketValue, 10) };
              })}
              domain={{
                x: [1, 7],
                y: [0, 30],
              }}
              standalone={false}
            />
          );
        })}
      </VictoryChart>
    </View>
  ) : (
    <></>
  );
}
