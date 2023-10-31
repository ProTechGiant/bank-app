import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View } from "react-native";
import { VictoryPie } from "victory-native";

import { Typography } from "@/components";
import { ChartData } from "@/features/MutualFund/components";

import { EstateIcon, GoldIcon, InvestmentIcon } from "../assets/icons";
import { mockChartData, mockInvestment } from "../mocks/mockPieChart";

interface Datum {
  x: string;
  y: number;
}

interface CustomLabelProps {
  x: number;
  y: number;
  datum: Datum;
}
function CustomLabel({ x, y, datum }: CustomLabelProps) {
  let IconComponent;
  if (datum.x === "Real Estate") {
    IconComponent = EstateIcon;
  } else if (datum.x === "Gold") {
    IconComponent = GoldIcon;
  } else {
    IconComponent = null;
  }

  if (I18nManager.isRTL) {
    const midpointAngle = (datum.startAngle + datum.endAngle) / 2;
    const innerRadius = 55;
    const outerRadius = 100;
    const centroidRadius = (1 * innerRadius + outerRadius) / 8;
    const iconX = x - 20 - centroidRadius * Math.cos(midpointAngle * (Math.PI / 180));
    const iconY = y - centroidRadius * Math.sin(midpointAngle * (Math.PI / 180));

    return (
      <Pressable
        style={[
          styles.iconPressable,
          { left: iconX, top: iconY, transform: [{ translateX: -12 }, { translateY: -12 }] },
        ]}
        onPress={() => console.log(datum.x)}>
        {IconComponent ? <IconComponent /> : null}
      </Pressable>
    );
  } else {
    return (
      <Pressable style={[styles.iconPressable, { left: x, top: y }]} onPress={() => console.log(datum.x)}>
        {IconComponent ? <IconComponent /> : null}
      </Pressable>
    );
  }
}

export default function PieChart() {
  const { t } = useTranslation();

  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);

  const handlePress = (datum: Datum) => {
    if (selectedSlice === datum.x) {
      setSelectedSlice(null);
    } else {
      setSelectedSlice(datum.x);
    }
  };

  const events = [
    {
      target: "data",
      eventHandlers: {
        onPress: (event: React.PressEvent<View>, { datum }: { datum: Datum }) => {
          handlePress(datum);
          return null;
        },
      },
    },
  ];

  return (
    <>
      <View style={styles.chartView}>
        <VictoryPie
          height={220}
          width={200}
          events={events}
          style={{
            data: {
              fillOpacity: 1,
              stroke: (d: Datum, active: boolean) => (active ? "black" : "transparent"),
              strokeWidth: 3,
              radius: (d: Datum, active: boolean, index: number) => {
                if (index === selectedSlice) return 110;
                return 100;
              },
            },
          }}
          cornerRadius={10}
          labelRadius={75}
          innerRadius={55}
          padAngle={12}
          radius={100}
          colorScale={["#DFD8F3", "#D8F3EF", "#DEEDC4"]}
          data={mockChartData}
          labelPosition="centroid"
          labelPlacement="perpendicular"
          labelComponent={<CustomLabel />}
        />
        <View style={styles.labelView}>
          <Typography.Text
            style={styles.captionText}
            align="center"
            weight="regular"
            size="caption1"
            color="neutralBase-10">
            {t("GoalGetter.GoalSetupPieChartModal.investmentAmount")}
          </Typography.Text>
          <Typography.Text style={styles.amountText} size="callout" align="center" weight="bold">
            {t("GoalGetter.GoalSetupPieChartModal.investmentAmountVAlue", { value: "1500" })}
          </Typography.Text>
          <InvestmentIcon />
        </View>
      </View>
      <ChartData assets={mockInvestment.Investments} selected={selectedSlice} />
    </>
  );
}

const styles = StyleSheet.create({
  amountText: {
    flexWrap: "wrap",
    maxWidth: 80,
  },
  captionText: {
    flexWrap: "wrap",
    maxWidth: 80,
  },
  chartView: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconPressable: {
    position: "absolute",
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  labelView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
});
