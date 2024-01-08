import { Pressable, StyleSheet, ViewStyle } from "react-native";

import Radio from "@/components/Radio";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface RadioButtonProps<T> {
  disabled?: boolean;
  label: string;
  onPress?: (value: T | undefined) => void;
  isSelected?: boolean;
  testID?: string;
  value?: T;
  variant?: "compact";
}

export default function RadioButton<T>({
  disabled = false,
  label,
  onPress,
  isSelected,
  testID,
  value,
  variant,
}: RadioButtonProps<T>) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    paddingVertical: theme.spacing["16p"],
    justifyContent: "flex-start",
  }));

  return (
    <Pressable onPress={() => onPress?.(value)} style={containerStyle} disabled={disabled} testID={testID}>
      {variant === "compact" ? (
        <>
          <Radio onPress={() => onPress?.(value)} isSelected={isSelected} disabled={disabled} value={value} />
          <Typography.Text weight="medium" size="callout" color="neutralBase" style={[styles.labelCompact]}>
            {label}
          </Typography.Text>
        </>
      ) : (
        <>
          <Typography.Text weight="medium" size="callout" color="neutralBase+30" style={[styles.label]}>
            {label}
          </Typography.Text>
          <Radio onPress={() => onPress?.(value)} isSelected={isSelected} disabled={disabled} value={value} />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    flexGrow: 1,
    marginEnd: 12,
  },
  labelCompact: {
    marginStart: 0,
  },
});
