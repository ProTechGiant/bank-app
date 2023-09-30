import { ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface GoalDataRowProps {
  label: string;
  value: any;
}

export default function GoalDataRow({ label, value }: GoalDataRowProps) {
  const stackStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <Stack direction="horizontal" justify="space-between" align="center" style={stackStyle}>
      <Stack direction="vertical" flex={1}>
        <Typography.Text color="neutralBase+30" size="callout" weight="medium">
          {label}
        </Typography.Text>
      </Stack>
      <Stack direction="vertical" align="flex-end" flex={1}>
        <Typography.Text color="neutralBase" size="callout" weight="medium">
          {value}
        </Typography.Text>
      </Stack>
    </Stack>
  );
}
