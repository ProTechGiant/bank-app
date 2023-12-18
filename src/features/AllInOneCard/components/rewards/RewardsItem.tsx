import { ViewStyle } from "react-native/types";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { MonthlyHistory } from "../../types";

interface RewardsItemProps {
  item: MonthlyHistory;
}

export default function RewardsItem({ item }: RewardsItemProps) {
  const itemStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  return (
    <Stack direction="horizontal" justify="space-between" style={itemStyle}>
      <Typography.Text size="callout" weight="medium" color="neutralBase+10">
        {item.Month} {item.Year}
      </Typography.Text>
      <Typography.Text size="callout" weight="medium" color="neutralBase+10">
        {item.Amount} {item.Currency}
      </Typography.Text>
    </Stack>
  );
}
