import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import PhoneInput from "react-phone-number-input/react-native-input";

import InputBox from "./internal/InputBox";

interface PhoneNumberInputProps<T extends FieldValues>
  extends Omit<
    React.ComponentProps<typeof PhoneInput>,
    "onBlur" | "onChangeText" | "onFocus" | "placeholderTextColor" | "style" | "value"
  > {
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
      />
    </InputBox>
  );
}
