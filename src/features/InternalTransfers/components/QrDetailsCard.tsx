import { ViewStyle } from "react-native";

import { Typography } from "@/components";
import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";

interface QrDetailsCardProps {
  title: string;
  value: string | undefined;
}

export default function QrDetailsCard({ title, value }: QrDetailsCardProps) {
  const navHeaderStackStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.neutralBaseHover,
    padding: theme.spacing["16p"],
    marginTop: theme.spacing["16p"],
    borderRadius: theme.radii.regular,
  }));

  return (
    <Stack direction="horizontal" style={navHeaderStackStyle} align="center" justify="space-between">
      <Stack direction="vertical" gap="4p">
        <Typography.Text color="neutralBase-60" size="footnote">
          {title}
        </Typography.Text>
        <Typography.Text color="neutralBase-60" size="footnote">
          {value}
        </Typography.Text>
      </Stack>
    </Stack>
  );
}
