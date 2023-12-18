import * as React from "react";
import { useEffect, useState } from "react";
import { View, ViewStyle } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LineChart from "react-native-simple-line-chart";

import ChartYearsBox from "@/components/ChartYearsBox";
import { useThemeStyles } from "@/theme";

import { calculateExpectedReturn, formatChartDate } from "../utils";
import PerformanceChartPointBox from "./PerformanceChartPointBox";

interface PerformanceChartProps {
  investmentAmount: number;
  performance: number;
}

export default function PerformanceChart({ investmentAmount, performance }: PerformanceChartProps) {
  const [lineWidth, setLineWidth] = useState<number>(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLineWidth(3);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  const ActivePointComponent = (point: { x: string; y: number }) => {
    return (
      <PerformanceChartPointBox
        yValue={point.y}
        xValue={formatChartDate(point.x)}
        investmentAmount={investmentAmount}
      />
    );
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing["16p"],
    marginVertical: theme.spacing["16p"],
    borderRadius: theme.radii.small,
  }));

  const containerBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    borderBottomWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: theme.palette.complimentBase,
  }));

  return (
    <View style={containerStyle}>
      <GestureHandlerRootView>
        <View style={containerBoxStyle}>
          <LineChart
            width={350}
            backgroundColor="transparent"
            extraConfig={{
              alwaysShowActivePoint: true,
              hideActivePointOnBlur: false,
              initialActivePoint: 50,
              endSpacing: 1,
            }}
            lines={[
              {
                data: calculateExpectedReturn(investmentAmount, performance, 5),
                activePointConfig: {
                  color: "#EC5F48",
                  borderColor: "white",
                  radius: 4,
                  showVerticalLine: true,
                  verticalLineColor: "#002233",
                  verticalLineOpacity: 1,
                  verticalLineWidth: 1,
                  verticalLineDashArray: [10, 3],
                },
                lineWidth: lineWidth,
                lineColor: ["#EC5F48", "#EC5F48"],
                fillColor: "rgba(236, 95, 72, 0.2)",
                curve: "linear",
                activePointComponent: ActivePointComponent,
              },
            ]}
          />
        </View>
      </GestureHandlerRootView>
      <ChartYearsBox count={5} justify="space-between" />
    </View>
  );
}
