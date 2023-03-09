import { ViewStyle } from "react-native/types";

import Stack from "@/components/Stack";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface SubcategorySectionProps {
  title: string;
  content: string;
  toggleStatus: boolean;
  onToggle: (status: boolean) => void;
}

export default function SubcategorySection({ title, content, toggleStatus, onToggle }: SubcategorySectionProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  return (
    <Stack direction="horizontal" gap="16p" align="center" style={containerStyle}>
      <Stack direction="vertical" gap="4p" flex={1}>
        <Typography.Text size="callout" weight="medium">
          {title}
        </Typography.Text>
        <Typography.Text color="neutralBase" size="footnote" weight="regular">
          {content}
        </Typography.Text>
      </Stack>
      <Toggle onPress={() => onToggle(!toggleStatus)} value={toggleStatus} />
    </Stack>
  );
}
