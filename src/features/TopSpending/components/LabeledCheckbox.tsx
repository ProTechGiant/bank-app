import React from "react";
import { View, ViewStyle } from "react-native";

import { CheckboxInput } from "@/components/Input";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface LabeledCheckboxProps {
  label: string;
  isSelect: boolean;
  onSelect: (args: boolean) => void;
}
export default function LabeledCheckbox({ onSelect, label, isSelect }: LabeledCheckboxProps) {
  const container = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    paddingVertical: theme.spacing["16p"],
    alignItems: "center",
    justifyContent: "space-between",
  }));

  return (
    <View style={container}>
      <Typography.Text weight="medium" size="callout">
        {label}
      </Typography.Text>
      <CheckboxInput value={isSelect} onChange={onSelect} />
    </View>
  );
}
