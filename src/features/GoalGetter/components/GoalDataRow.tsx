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
    width: "100%",
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <Stack direction="horizontal" justify="space-between" gap="16p" style={stackStyle}>
      <Typography.Text color="neutralBase+30" size="callout" weight="medium">
        {label}
      </Typography.Text>
      <Typography.Text color="neutralBase" size="callout" weight="medium">
        {value}
      </Typography.Text>
    </Stack>
  );
}
