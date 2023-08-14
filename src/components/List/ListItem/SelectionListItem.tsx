import { cloneElement } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { useListContext } from "../context/ListContext";

export interface SelectionListItemProps {
  label: string;
  onPress?: () => void;
  disabled: boolean;
  end: React.ReactElement<{ onPress?: () => void; disabled: boolean }>;
}

export default function SelectionListItem({ label, onPress, disabled, end }: SelectionListItemProps) {
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
        <Typography.Text
          color={disabled ? "neutralBase-30" : variant === "dark" ? "neutralBase-60" : "neutralBase+30"}
          size="body"
          weight="regular">
          {label}
        </Typography.Text>
      </View>
      {cloneElement(end, { disabled: disabled })}
    </Stack>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
});
