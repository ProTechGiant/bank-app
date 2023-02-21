import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { I18nManager, TextStyle } from "react-native";
import PhoneInput from "react-phone-number-input/react-native-input";

import { useThemeStyles } from "@/theme";

import InputBox from "./internal/InputBox";

interface PhoneNumberInputProps<T extends FieldValues> {
  control: Control<T>;
  extra?: React.ComponentProps<typeof InputBox>["extraStart"];
  isEditable?: boolean;
  name: Path<T>;
  label?: string;
  placeholder?: string;
}

export default function PhoneNumberInput<T extends FieldValues>({
  control,
  extra,
  isEditable,
  name,
  label,
  placeholder,
}: PhoneNumberInputProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const [isFocused, setIsFocused] = useState(false);

  const textStyles = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette["neutralBase+20"],
    flexGrow: 1,
    fontSize: theme.typography.text.sizes.callout,
    fontWeight: theme.typography.text.weights.regular,
    padding: 0,
  }));

  const placeholderTextColor = useThemeStyles(theme => theme.palette.neutralBase);

  return (
    <InputBox extraStart={extra} isEditable={isEditable} isFocused={isFocused} label={label} fieldState={fieldState}>
      <PhoneInput
        autoCapitalize="none"
        autoCorrect={false}
        onBlur={() => {
          setIsFocused(false);
          field.onBlur();
        }}
        onChange={value => field.onChange(value)}
        onFocus={() => setIsFocused(true)}
        international
        country="SA"
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={textStyles}
        value={field.value}
        textAlign={I18nManager.isRTL ? "right" : "left"}
      />
    </InputBox>
  );
}
