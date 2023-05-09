import { View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface CaseStatusCardProps {
  label: string;
  description: string;
  isLast?: boolean;
}

export default function CaseStatusCard({ label, description, isLast }: CaseStatusCardProps) {
  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderBottomColor: isLast ? "transparent" : theme.palette["neutralBase-40"],
      borderBottomWidth: 1,
      paddingVertical: theme.spacing["12p"],
      width: "100%",
    }),
    [isLast]
  );

  const labelStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["4p"],
  }));

  return (
    <Stack direction="horizontal" align="center" gap="16p" style={containerStyle}>
      <View style={{ flex: 1 }}>
        <Typography.Text size="footnote" weight="regular" color="neutralBase" style={labelStyle}>
          {label}
        </Typography.Text>
        <Typography.Text size="callout" weight="regular" color="neutralBase+30">
          {description}
        </Typography.Text>
      </View>
    </Stack>
  );
}
