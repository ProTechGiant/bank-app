import { useTranslation } from "react-i18next";
import { Image, ImageStyle, Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { BarChart } from "react-native-gifted-charts";

import { AngleDownIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { HiddenBarChart, NeraPlusTag, UpgradeTag } from "../assets/images";
import { emptyBarChart, mockBarData as barData, totalSpending } from "../mocks";

interface SpendingBarChartProps {
  isTransactionsFound: boolean;
}
export default function SpendingBarChart({ isTransactionsFound }: SpendingBarChartProps) {
  const { t } = useTranslation();
  const maxValue: number = Math.max(...barData.map(item => item.value));
  const selectedCurrency = "SAR"; //TODO add many currency from  API later
  const cardType = "NeraPlus"; //TODO : get type card from context

  const isCardNera = cardType.toLowerCase() === "nera";

  const marginTopStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
  }));

  const currencyStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["4p"],
    paddingLeft: theme.spacing["12p"],
    paddingRight: theme.spacing["4p"],
    marginTop: theme.spacing["4p"],
    borderWidth: 1,
    borderRadius: theme.radii.xxlarge,
    borderColor: theme.palette["neutralBase+30"],
  }));

  const chartContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    marginTop: theme.spacing["16p"],
    marginBottom: theme.spacing["32p"],
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.medium,
    minHeight: 270,
  }));

  const chartLineColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);
  const chartLineBorder = useThemeStyles(theme => theme.spacing["4p"]);
  const axisTextStyle = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette.neutralBase,
    fontSize: theme.typography.text.sizes.caption2,
  }));
  const tagStyle = useThemeStyles<ImageStyle>(theme => ({
    height: theme.spacing["20p"],
    borderRadius: theme.radii.extraSmall,
    width: 85,
  }));
  const iconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <View style={chartContainerStyle}>
      <Stack direction="horizontal" justify="space-between">
        <View>
          <Typography.Text size="caption1" weight="regular" color="neutralBase">
            {t("AllInOneCard.AllTransactionsScreen.spendingSummary.totalSpending")}
          </Typography.Text>
          <Typography.Text size="body" weight="semiBold" color="neutralBase+30" style={marginTopStyle}>
            {isTransactionsFound ? totalSpending.toLocaleString() : " 00.0"}{" "}
            {t("AllInOneCard.AllTransactionsScreen.spendingSummary.sar")}
          </Typography.Text>
        </View>
        {isCardNera ? (
          <Image source={NeraPlusTag} style={tagStyle} />
        ) : (
          <Stack direction="horizontal" gap="4p" align="center" style={currencyStyle}>
            <Typography.Text size="footnote" weight="medium" color="neutralBase+30">
              {selectedCurrency}
            </Typography.Text>
            <AngleDownIcon color={iconColor} />
          </Stack>
        )}
      </Stack>
      {isCardNera ? (
        <Pressable>
          <Image source={UpgradeTag} style={styles.UpgradeTagImage} />
          <Image source={HiddenBarChart} />
        </Pressable>
      ) : isTransactionsFound ? (
        <BarChart
          data={barData}
          barWidth={20}
          xAxisLabelTextStyle={axisTextStyle}
          xAxisIndicesWidth={0}
          spacing={28}
          xAxisColor="none"
          rulesColor="none"
          yAxisThickness={0}
          maxValue={maxValue}
          noOfSections={2}
          yAxisTextStyle={axisTextStyle}
          rulesType="solid"
          frontColor={chartLineColor}
          xAxisThickness={0}
          initialSpacing={8}
          yAxisLabelSuffix={" " + selectedCurrency}
          barBorderTopLeftRadius={chartLineBorder}
          barBorderTopRightRadius={chartLineBorder}
          yAxisLabelWidth={50}
          height={140}
        />
      ) : (
        <BarChart
          data={emptyBarChart}
          xAxisLabelTextStyle={axisTextStyle}
          xAxisIndicesWidth={0}
          spacing={20}
          xAxisColor="none"
          rulesColor="none"
          yAxisThickness={0}
          maxValue={1000}
          noOfSections={2}
          yAxisTextStyle={axisTextStyle}
          rulesType="solid"
          frontColor={chartLineColor}
          yAxisLabelSuffix={" " + selectedCurrency}
          yAxisLabelWidth={50}
          height={140}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  UpgradeTagImage: {
    bottom: "50%",
    position: "absolute",
    right: "20%",
    zIndex: 1,
  },
});
