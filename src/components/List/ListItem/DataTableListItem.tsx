import { Pressable, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { useListContext } from "../context/ListContext";

export interface DataTableListItemProps {
  label: string;
  helperText?: string;
  end?: React.ReactNode;
  onPress?: () => void;
  isError?: boolean;
  testID?: string;
}

export default function DataTableListItem({
  label,
  helperText,
  onPress,
  isError,
  end,
  testID,
}: DataTableListItemProps) {
  const variant = useListContext();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
    backgroundColor: variant === "dark" ? theme.palette["primaryBase-70-8%"] : theme.palette["neutralBase-50"],
  }));

  return (
    <Stack
      direction="horizontal"
      align="center"
      justify="space-between"
      gap="16p"
      as={Pressable}
      onPress={onPress}
      style={containerStyle}
      testID={testID}>
      <Stack direction="vertical" gap="4p" flex={1}>
        <Stack direction="horizontal" align="center">
          <Typography.Text
            color={variant === "dark" ? "neutralBase-60" : "neutralBase+30"}
            size="callout"
            weight="medium">
            {label}
          </Typography.Text>
        </Stack>
        {helperText !== undefined ? (
          <Typography.Text color={isError ? "errorBase" : "neutralBase"} size="footnote">
            {helperText}
          </Typography.Text>
        ) : null}
      </Stack>
      {end}
    </Stack>
  );
}
