import React from "react";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { VictoryPie } from "victory-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface PieChartProps {
  data: { x: string; y: number }[];
}

export default function PieChart({ data }: PieChartProps) {
  const maxValue = Math.max(...data.map(item => item.y));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: theme.spacing["20p"],
    flexDirection: "row",
    alignItems: "center",
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing["8p"],
    marginHorizontal: theme.spacing["16p"],
  }));

  const donutChart = useThemeStyles<ViewStyle>(theme => ({
    width: 40,
    height: 40,
    backgroundColor: theme.palette["neutralBase-60"],
    borderWidth: theme.spacing["8p"],
    borderRadius: theme.radii.xxlarge,
  }));

  const sectionsTextStyle = useThemeStyles<TextStyle>(theme => ({
    paddingHorizontal: theme.spacing["4p"],
  }));

  return (
    <View style={styles.centerAlignItems}>
      <VictoryPie data={data} innerRadius={90} colorScale={["#DFE8EC", "#5F8CA0", "#BFD1D9"]} labels={() => ""} />
      <View style={containerStyle}>
        {data.map((item, index) => (
          <View key={index} style={contentStyle}>
            <View
              style={[
                donutChart,
                { borderColor: item.y === maxValue ? "#DFE8EC" : item.y === data[1].y ? "#5F8CA0" : "#BFD1D9" },
              ]}
            />
            <View>
              <Typography.Text size="callout" weight="medium" style={sectionsTextStyle}>
                {item.x}
              </Typography.Text>
              <Typography.Text size="caption2" weight="medium" style={sectionsTextStyle} color="neutralBase">
                {`${item.y}%`}
              </Typography.Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerAlignItems: {
    alignItems: "center",
    justifyContent: "center",
  },
});
