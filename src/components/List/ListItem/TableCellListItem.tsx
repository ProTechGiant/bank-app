import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { useListContext } from "../context/ListContext";

export interface TableCellListItemProps {
  label: string;
  helperText?: string;
  end: React.ReactNode;
  onPress?: () => void;
}

export default function TableCellListItem({ label, helperText, onPress, end }: TableCellListItemProps) {
  const variant = useListContext();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["8p"],
    paddingBottom: theme.spacing["4p"],
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
      <View style={styles.textContainer}>
        <Stack direction="horizontal" align="center">
          <Typography.Text
            color={variant === "dark" ? "neutralBase-60" : "neutralBase+30"}
            size="callout"
            weight="medium">
            {label}
          </Typography.Text>
        </Stack>
        {helperText !== undefined ? (
          <Typography.Text color="neutralBase" size="caption2">
            {helperText}
          </Typography.Text>
        ) : null}
      </View>
      {end}
    </Stack>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
});
