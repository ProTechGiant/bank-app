import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { Stack } from "@/components";
import { useThemeStyles } from "@/theme";

import { Investment } from "../types";
import ChartDataItem from "./ChartDataItem";

interface ChartDataProps {
  assets: Investment[];
  selected: string | null;
}

export default function ChartData({ assets, selected }: ChartDataProps) {
  const { t } = useTranslation();

  const stackContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const innerStackStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    borderRadius: theme.radii.small,
    borderWidth: 1,
  }));

  return (
    <Stack direction="vertical" gap="20p" style={stackContainerStyle}>
      {assets.map(asset => {
        return (
          <Stack
            direction="horizontal"
            gap="16p"
            justify="space-between"
            style={[
              {
                backgroundColor: asset.assetName === selected ? "lightgray" : "transparent",
                borderColor: asset.assetName === selected ? "lightgray" : "transparent",
              },
              innerStackStyle,
            ]}>
            <ChartDataItem
              assetName={asset.assetName}
              assetValue={asset.percentage}
              assetColor={asset.color}
              highlighted={asset.assetName === selected}
            />
            <ChartDataItem
              assetName={t("MutualFund.MutualFundDetailsScreen.AssetAllocation.investmentAmount")}
              assetValue={asset.investmentAmount}
              highlighted={asset.assetName === selected}
            />
          </Stack>
        );
      })}
    </Stack>
  );
}
