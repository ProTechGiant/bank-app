import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { VictoryPie } from "victory-native";

import { Typography } from "@/components";

import { CashMarketIcon, SharesFundIcon, SoukIcon } from "../assets/icons";
import { ChartData } from "../components";
import { mockChartData, mockInvestment } from "../mocks/mockInvestment";

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
  //TODO: until the api is ready
  if (datum.x === "Cash Markets Fund") {
    IconComponent = CashMarketIcon;
  } else if (datum.x === "sharesFund") {
    IconComponent = SharesFundIcon;
  } else {
    IconComponent = SoukIcon;
  }

  return (
    <Pressable style={[styles.iconPressable, { left: x, top: y }]} onPress={() => console.log(datum.x)}>
      <IconComponent />
    </Pressable>
  );
}

export default function PieChart() {
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
          {/* TODO: this value will be changed when api is ready */}
          <Typography.Text style={styles.captionText} align="center">
            Assets Allocation
          </Typography.Text>
          <Typography.Text style={styles.amountText} size="footnote" align="center">
            1500 SR
          </Typography.Text>
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
    marginTop: 40,
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
