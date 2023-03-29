import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Radio from "@/components/Radio";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface RadioButtonProps<T> {
  disabled?: boolean;
  label: string;
  onPress?: (value: T | undefined) => void;
  isSelected?: boolean;
  value?: T | undefined;
}

export default function RadioButton<T>({ disabled = false, label, onPress, isSelected, value }: RadioButtonProps<T>) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    paddingVertical: theme.spacing["16p"],
  }));

  return (
    <Pressable onPress={() => onPress?.(value)} style={[containerStyle, { opacity: disabled ? 0.2 : 1 }]}>
      <Typography.Text weight="medium" size="callout" style={styles.label}>
        {label}
      </Typography.Text>
      <Radio onPress={() => onPress?.(value)} isSelected={isSelected} disabled={disabled} value={value} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    flexGrow: 1,
  },
});
