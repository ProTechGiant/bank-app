import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { useListContext } from "../context/ListContext";

export interface SecordaryListItemProps {
  label: string;
  onPress?: () => void;
  end?: React.ReactNode;
}

export default function SecordaryListItem({ label, onPress, end }: SecordaryListItemProps) {
  const variant = useListContext();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
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
        <Typography.Text color={variant === "dark" ? "neutralBase-60" : "neutralBase+30"} size="callout">
          {label}
        </Typography.Text>
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
