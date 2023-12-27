import { Pressable, ViewStyle } from "react-native";

import Radio from "@/components/Radio";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface FatcaRadioButtonProps<T> {
  disabled?: boolean;
  label: string;
  onPress?: (value: T | undefined) => void;
  isSelected?: boolean;
  testID?: string;
  value?: T;
}

export default function FatcaRadioButton<T>({
  disabled = false,
  label,
  onPress,
  isSelected,
  testID,
  value,
}: FatcaRadioButtonProps<T>) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    paddingVertical: theme.spacing["16p"],
  }));

  return (
    <Pressable onPress={() => onPress?.(value)} style={containerStyle} disabled={disabled} testID={testID}>
      <Radio onPress={() => onPress?.(value)} isSelected={isSelected} disabled={disabled} value={value} />
      <Typography.Text
        testID="Onboarding.FatcaRadioButton:labelText"
        weight="regular"
        size="footnote"
        style={[{ opacity: disabled ? 0.2 : 1 }]}
        color="neutralBase">
        {label}
      </Typography.Text>
    </Pressable>
  );
}
