import { t } from "i18next";
import React, { useState } from "react";
import { Alert, I18nManager, Image, ImageSourcePropType, Pressable, View, ViewStyle } from "react-native";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryLabel } from "victory-native";

import FormatTransactionAmount from "@/components/FormatTransactionAmount";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { DAILY_INTERVAL, MONTHLY_INTERVAL, WEEKLY_INTERVAL, YEARLY_INTERVAL } from "../constants";
import { ChartTypes, UserTypes } from "../enum";
import { DWMData, SingleBarChart, SingleChartDataType, YearData } from "../types";

interface ChartProps {
  graph: DWMData & YearData & SingleChartDataType;
  type: ChartTypes;
  isClickable: boolean;
}
export default function SingleChart({ graph, type, isClickable = false }: ChartProps) {
  const [userType, setUserType] = useState(UserTypes.STANDARD);

  const isRTL = I18nManager.isRTL;
  const padding = {
    left: isRTL ? 80 : 20,
    right: isRTL ? 60 : 130,
    top: 25,
    bottom: 30,
  };

  const isEven = (num: number) => num % 2 === 0;
  const formatRightAxisTick = (tick: number, index: number) =>
    isEven(index) ? `   ${tick} ${t("TopSpending.SpendSummaryScreen.sr")}` : "";

  //TODO : will handle the upgrade in the next BC
  const handleOnPressUpgrade = () => {
    Alert.alert(t("TopSpending.UpgradeTierModal.title"), t("TopSpending.UpgradeTierModal.subTitle"), [
      {
        text: t("TopSpending.UpgradeTierModal.cancel"),
        style: "cancel",
      },
      {
        text: t("TopSpending.UpgradeTierModal.upgrade"),
        onPress: () => {
          setUserType(UserTypes.PLUS);
        },
      },
    ]);
  };

  let interval: number;
  let data: SingleChartDataType;
  let graphHiddenImage: ImageSourcePropType;
  switch (type) {
    case ChartTypes.LAST_SIX_MONTH:
      interval = YEARLY_INTERVAL;
      data = graph;
      graphHiddenImage = require("../assets/images/last-six-months.png");
      break;
    case ChartTypes.MONTHLY:
      interval = MONTHLY_INTERVAL;
      data = graph.Monthly;
      graphHiddenImage = require("../assets/images/hidden-graph-monthly.png");
      break;
    case ChartTypes.DAILY:
      interval = DAILY_INTERVAL;
      data = graph.Daily;
      graphHiddenImage = require("../assets/images/hidden-graph-daily.png");
      break;
    case ChartTypes.WEEKLY:
      interval = WEEKLY_INTERVAL;
      data = graph.Weekly;
      graphHiddenImage = require("../assets/images/hidden-graph-weekly.png");
      break;
    case ChartTypes.YEARLY:
      interval = YEARLY_INTERVAL;
      data = graph.Yearly;
      graphHiddenImage = require("../assets/images/hidden-graph-yearly.png");
      break;
  }

  const averageNumbers = getAverage(data.chartData);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    display: "flex",
    justifyContent: "center",
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const victoryAxisStyle = useThemeStyles(theme => ({
    fontSize: theme.typography.text.sizes.caption2,
    fill: theme.palette.neutralBase,
    fontWeight: theme.typography.text.weights.medium,
  }));

  const neutralBaseColor = useThemeStyles(theme => theme.palette["neutralBase-40"]);
  const primaryBaseColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);
  const complimentBaseColor = useThemeStyles(theme => theme.palette.complimentBase);
  const chartHeight = 185;

  return (
    <View style={containerStyle}>
      <Stack direction="horizontal" justify="space-between" align="center">
        <View>
          <Typography.Text size="caption1" color="neutralBase">
            {t("TopSpending.SpendSummaryScreen.totalSpending")}
          </Typography.Text>
          <Stack direction="horizontal" align="center" gap="4p">
            <Typography.Text size="title3" color="neutralBase+30">
              <FormatTransactionAmount
                amount={data.total}
                isPlusSignIncluded={false}
                integerSize="title2"
                decimalSize="title2"
                color="neutralBase+30"
                isCurrencyIncluded={false}
              />
            </Typography.Text>
            <Typography.Text size="title3" weight="bold" color="neutralBase+30">
              {t("TopSpending.SpendSummaryScreen.sr")}
            </Typography.Text>
          </Stack>
        </View>
        {userType !== UserTypes.PLUS && (
          <Pressable onPress={handleOnPressUpgrade}>
            <Image
              source={require("../assets/images/croatia-plus.png")}
              style={{ width: 100, height: 20 }}
              borderRadius={2}
            />
          </Pressable>
        )}
      </Stack>
      {userType !== UserTypes.PLUS ? (
        <Pressable onPress={handleOnPressUpgrade}>
          <Image source={graphHiddenImage} />
        </Pressable>
      ) : (
        <VictoryChart height={chartHeight} padding={padding}>
          <VictoryAxis
            tickValues={data.chartData.map(item => item.interval)}
            style={{
              axis: { stroke: "none" },
              tickLabels: victoryAxisStyle,
            }}
          />
          <VictoryAxis
            dependentAxis
            orientation="right"
            tickValues={averageNumbers}
            tickCount={7}
            style={{
              tickLabels: victoryAxisStyle,
              axis: { stroke: "none" },
              grid: { stroke: neutralBaseColor, strokeWidth: 1 },
            }}
            tickFormat={formatRightAxisTick}
          />
          <VictoryGroup offset={interval}>
            <VictoryBar
              data={data.chartData}
              x="interval"
              y="value"
              barWidth={type === ChartTypes.DAILY ? 6 : 0}
              cornerRadius={4}
              style={{ data: { fill: complimentBaseColor } }}
              labels={() => null}
              labelComponent={
                <VictoryLabel
                  style={{ fill: "white" }}
                  backgroundPadding={{ top: 6, bottom: 4, left: 8, right: 8 }}
                  dy={-15}
                  backgroundStyle={{ fill: primaryBaseColor }}
                />
              }
              events={
                isClickable
                  ? [
                      {
                        target: "data",
                        eventHandlers: {
                          onPress: () => {
                            return [
                              {
                                target: "labels",
                                mutation: props => {
                                  const text = props.datum.value;
                                  return props.text === text ? null : { text };
                                },
                              },
                              {
                                target: "data",
                                mutation: props => {
                                  const fill = props.style.fill;
                                  return fill === primaryBaseColor ? null : { style: { fill: primaryBaseColor } };
                                },
                              },
                            ];
                          },
                        },
                      },
                    ]
                  : []
              }
            />
          </VictoryGroup>
        </VictoryChart>
      )}
    </View>
  );
}

const getAverage = (data: SingleBarChart[]) => {
  if (data.length) {
    const max = Math.max(...data.map(({ value }) => Math.max(value)));
    const min = Math.min(...data.map(({ value }) => Math.min(value)));

    const array = [];
    for (let i = 0; i < 7; i++) {
      const average = Math.round((min + (max - min) * (i / 6)) / 10) * 10;
      array.push(average);
    }
    return array;
  } else {
    return [0, 10, 20, 30, 40, 50, 60];
  }
};
