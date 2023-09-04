import { ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ListSectionProps {
  banner?: React.ReactNode;
  children: React.ReactNode;
  title: string;
}

export default function ListSection({ children, title }: ListSectionProps) {
  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <Stack align="stretch" direction="vertical">
      <Typography.Text size="title3" weight="regular" style={titleStyle}>
        {title}
      </Typography.Text>
      {children}
    </Stack>
  );
}
