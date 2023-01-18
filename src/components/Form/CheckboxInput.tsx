import CheckBox from "@react-native-community/checkbox";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import InputBox from "./internal/InputBox";

interface CheckboxInputProps<T extends FieldValues> {
  bordered?: boolean;
  control: Control<T>;
  isEditable?: boolean;
  name: Path<T>;
  label?: string;
}

export default function CheckboxInput<T extends FieldValues>({
  bordered = true,
  control,
  isEditable = true,
  name,
  label,
}: CheckboxInputProps<T>) {
  const { field, fieldState } = useController({ control, name });

  const checkBoxColors = useThemeStyles(
    ({ palette }) => ({
      // Android-only,
      tintColors: { true: palette.complimentBase, false: palette["neutralBase-20"] },
      // iOS-only,
      lineWidth: 2,
      tintColor: "transparent",
      onCheckColor: palette["neutralBase-50"],
      onFillColor: palette.complimentBase,
      onTintColor: "transparent",
    }),
    []
  );

  const checkBoxStyles = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: !isEditable ? theme.palette["neutralBase-40"] : undefined,
      borderColor: theme.palette["neutralBase-20"],
      borderRadius: 2,
      borderWidth: 1,
      marginRight: 8,
      height: 24,
      width: 24,
    }),
    [isEditable]
  );

  return (
    <InputBox bordered={bordered} isFocused={true === field.value} fieldState={fieldState}>
      <View style={{ alignItems: "center", flexDirection: "row" }}>
        <CheckBox
          {...checkBoxColors}
          disabled={!isEditable}
          boxType="square"
          onValueChange={nextValue => field.onChange(nextValue)}
          style={checkBoxStyles}
          value={field.value}
        />
        <Typography.Text color="tintBase+30" size="callout" weight="regular">
          {label}
        </Typography.Text>
      </View>
    </InputBox>
  );
}
