import * as React from "react";
import { View, ViewStyle } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LineChart from "react-native-simple-line-chart";

import ChartYearsBox from "@/components/ChartYearsBox";
import { useThemeStyles } from "@/theme";

import { GoalGetterProduct } from "../types";
import { calculateExpectedReturn, formatChartDate } from "../utils";
import ChartHorizontalLines from "./ChartHorizontalLines";
import PerformanceChartPointBox from "./PerformanceChartPointBox";

interface PerformanceChartProps {
  investmentAmount: number;
  productList: GoalGetterProduct[];
}

export default function PerformanceChart({ investmentAmount, productList }: PerformanceChartProps) {
  const ActivePointComponent = (productName: string) => (point: { x: string; y: number }) => {
    return <PerformanceChartPointBox yValue={point.y} xValue={formatChartDate(point.x)} productName={productName} />;
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    paddingTop: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-60"],
    borderRadius: theme.radii.small,
  }));

  const containerBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    width: 280,
    height: 127,
    borderWidth: 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderColor: theme.palette["neutralBase-60"],
    zIndex: 2,
  }));

  const lineColorStyle = useThemeStyles<string>(theme => theme.palette.primaryBase);

  const borderColorStyle = useThemeStyles<string>(theme => theme.palette["neutralBase-60"]);

  const lineColorLookUp = ["rgba(236, 95, 72, 0.7)", "rgba(215, 55, 152, 0.2)"];

  return (
    <View style={containerStyle}>
      <GestureHandlerRootView>
        <ChartHorizontalLines count={5} />
        <View style={containerBoxStyle}>
          <LineChart
            height={127}
            width={280}
            backgroundColor="transparent"
            extraConfig={{
              alwaysShowActivePoint: true,
              hideActivePointOnBlur: false,
              initialActivePoint: 50,
              endSpacing: 1,
            }}
            lines={productList.map((product, index) => ({
              data: calculateExpectedReturn(investmentAmount, product?.ProfitPercentage || 0, 5),
              activePointConfig: {
                color: "#EC5F48",
                borderColor: borderColorStyle,
                radius: 4,
                showVerticalLine: true,
                verticalLineColor: lineColorStyle,
                verticalLineOpacity: 1,
                verticalLineWidth: 1,
                verticalLineDashArray: [10, 3],
              },
              lineWidth: 2,
              lineColor: ["#EC5F48", "#EC5F48"],
              fillColor: lineColorLookUp[index],
              curve: "linear",
              activePointComponent: ActivePointComponent(product.ProductName),
            }))}
          />
        </View>
      </GestureHandlerRootView>
      <ChartYearsBox count={5} />
    </View>
  );
}
