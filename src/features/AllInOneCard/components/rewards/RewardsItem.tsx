import { ViewStyle } from "react-native/types";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { Rewards } from "../../types";

interface RewardsItemProps {
  item: Rewards;
}

export default function RewardsItem({ item }: RewardsItemProps) {
  const itemStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  return (
    <Stack direction="horizontal" justify="space-between" style={itemStyle}>
      <Typography.Text size="callout" weight="medium" color="neutralBase+10">
        {item.date}{" "}
      </Typography.Text>
      <Typography.Text size="callout" weight="medium" color="neutralBase+10">
        {item.value}{" "}
      </Typography.Text>
    </Stack>
  );
}
