import { Pressable, ViewStyle } from "react-native";

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
}

export default function PayBillRadioButton<T>({
  disabled = false,
  label,
  onPress,
  isSelected,
  testID,
  value,
}: RadioButtonProps<T>) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    paddingVertical: theme.spacing["12p"],
  }));
  return (
    <Pressable onPress={() => onPress?.(value)} style={containerStyle} disabled={disabled} testID={testID}>
      <Radio onPress={() => onPress?.(value)} isSelected={isSelected} disabled={disabled} value={value} />
      <Typography.Text weight="medium" size="callout" color="neutralBase" style={{ opacity: disabled ? 0.2 : 1 }}>
        {label}
      </Typography.Text>
    </Pressable>
  );
}
