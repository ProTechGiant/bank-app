import { Pressable, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { useListContext } from "../context/ListContext";

export interface TableListItemProps {
  label: string;
  caption?: string;
  end?: React.ReactNode;
  onPress?: () => void;
}

export default function TableListItem({ label, caption, onPress, end }: TableListItemProps) {
  const variant = useListContext();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <Stack
      direction="horizontal"
      align="center"
      justify="space-between"
      gap="16p"
      as={Pressable}
      onPress={onPress}
      style={containerStyle}>
      <Stack direction="vertical" gap="4p" flex={1}>
        {caption !== undefined ? (
          <Typography.Text color={variant === "dark" ? "neutralBase-20" : "neutralBase"} size="footnote">
            {caption}
          </Typography.Text>
        ) : null}
        <Stack direction="horizontal" align="center">
          <Typography.Text
            weight="medium"
            color={variant === "dark" ? "neutralBase-60" : "neutralBase+30"}
            size="callout">
            {label}
          </Typography.Text>
        </Stack>
      </Stack>
      {end}
    </Stack>
  );
}
