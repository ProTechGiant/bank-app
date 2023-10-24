import * as React from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LineChart from "react-native-simple-line-chart";

import { Stack } from "@/components";
import Alert from "@/components/Alert";
import { useThemeStyles } from "@/theme";

import { calculateExpectedReturn, calculateExpectedReturnForYears, formatChartDate } from "../utils";
import ChartHorizontalLines from "./ChartHorizontalLines";
import ChartReturnBox from "./ChartReturnBox";
import ChartYearsBox from "./ChartYearsBox";
import PerformanceChartPointBox from "./PerformanceChartPointBox";

interface PerformanceChartProps {
  investmentAmount: number;
  performance: number;
}

export default function PerformanceChart({ investmentAmount, performance }: PerformanceChartProps) {
  const { t } = useTranslation();

  const ActivePointComponent = (point: { x: string; y: number }) => {
    return <PerformanceChartPointBox yValue={point.y} xValue={formatChartDate(point.x)} />;
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing["16p"],
    marginVertical: theme.spacing["16p"],
    backgroundColor: "white",
    borderRadius: theme.radii.small,
  }));

  const containerBoxStyle = useThemeStyles<ViewStyle>(() => ({
    width: 280,
    height: 127,
    borderWidth: 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "white",
    zIndex: 2,
  }));

  const warningBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["16p"],
  }));

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
            lines={[
              {
                // TODO: add performance value from api integration instead of static value 0.7
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
                lineWidth: 2,
                lineColor: ["#EC5F48", "#EC5F48"],
                fillColor: "rgba(236, 95, 72, 0.2)",
                curve: "linear",
                activePointComponent: ActivePointComponent,
              },
            ]}
          />
        </View>
      </GestureHandlerRootView>
      <ChartYearsBox count={5} />
      <ChartReturnBox
        oneYearReturn={calculateExpectedReturnForYears(investmentAmount, performance, 1)}
        fiveYearReturn={calculateExpectedReturnForYears(investmentAmount, performance, 5)}
      />
      <Stack direction="vertical" style={warningBoxStyle}>
        <Alert variant="warning" message={t("MutualFund.MutualFundDetailsScreen.warningText")} />
      </Stack>
    </View>
  );
}
