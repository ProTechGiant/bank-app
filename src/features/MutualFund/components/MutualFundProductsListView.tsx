import { ScrollView, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import ProgressWheel from "@/components/ProgressWheel";
import { useThemeStyles } from "@/theme";

import { AssetAllocationResponse } from "../types";

interface MutualFundProductsListViewProps {
  assetAllocationData?: AssetAllocationResponse;
}

export default function MutualFundProductsListView({ assetAllocationData }: MutualFundProductsListViewProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  const innerContentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    borderRadius: theme.radii.medium,
  }));

  return assetAllocationData !== undefined ? (
    <ScrollView horizontal style={containerStyle} contentContainerStyle={innerContentStyle}>
      <Stack direction="horizontal" gap="16p">
        {assetAllocationData.AssetAllocation.map((item, index) => {
          return (
            <Stack
              key={index}
              direction="horizontal"
              gap="16p"
              align="center"
              style={{
                ...contentStyle,
                backgroundColor: item.Color,
              }}>
              <Typography.Text color="primaryBase" size="callout" weight="semiBold">
                {item.Name}
              </Typography.Text>
              <ProgressWheel current={Number(item.Ratio)} total={1} circleSize={47} textSize="footnote" />
            </Stack>
          );
        })}
      </Stack>
    </ScrollView>
  ) : null;
}
