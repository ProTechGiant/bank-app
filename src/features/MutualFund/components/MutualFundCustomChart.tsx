import { View, ViewStyle } from "react-native";
import { VictoryAxis, VictoryChart, VictoryLine } from "victory-native";

import { useThemeStyles } from "@/theme";

import { lineDetails } from "../types";

interface MutualFundCustomChartProps {
  tickLabelsColor: string;
  gridStrokeColor: string;
  chartBorderColor: string;
  chartBackgroundColor?: string;
  mutualFundCustomChartList: lineDetails[];
}

export default function MutualFundCustomChart({
  tickLabelsColor,
  gridStrokeColor,
  chartBorderColor,
  chartBackgroundColor,
  mutualFundCustomChartList,
}: MutualFundCustomChartProps) {
  const chartViewStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderRadius: theme.radii.small,
      borderColor: chartBorderColor,
      borderWidth: 1,
      backgroundColor: chartBackgroundColor,
    }),
    [chartBackgroundColor, chartBorderColor]
  );

  return (
    <View style={chartViewStyle}>
      <VictoryChart width={350} height={220} animate={{ duration: 1500 }}>
        <VictoryAxis
          style={{
            tickLabels: {
              fill: tickLabelsColor,
            },
          }}
          tickValues={[1, 2, 3, 4, 5, 6, 7]}
          tickFormat={t => `${t}D`}
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
        {mutualFundCustomChartList.map(portfolio => {
          return (
            <VictoryLine
              style={{ data: { stroke: `${portfolio.color}`, strokeWidth: 4.5 } }}
              data={portfolio.data}
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
  );
}
