import { Control, FieldValues, Path, useController } from "react-hook-form";
import { TextInputProps as RNTextInputProps } from "react-native";

import StyledTextInput from "../TextInput";
import InputBox from "./internal/InputBox";

interface TextInputProps<T extends FieldValues>
  extends Omit<
    RNTextInputProps,
    "onBlur" | "onChangeText" | "onFocus" | "placeholderTextColor" | "placeholder" | "style" | "value"
  > {
  control: Control<T>;
  extra?: React.ComponentProps<typeof InputBox>["extraStart"];
  isEditable?: boolean;
  name: Path<T>;
  placeholder?: string | null | undefined;
  label?: string | null;
  showCharacterCount?: boolean;
  icon?: React.ReactElement;
}

export default function TextInput<T extends FieldValues>({
  control,
  extra,
  isEditable,
  label,
  maxLength,
  multiline,
  name,
  showCharacterCount,
  placeholder,
  icon,
  ...restProps
}: TextInputProps<T>) {
  const { field, fieldState } = useController({ control, name });

  return (
    <StyledTextInput
      extra={extra}
      isEditable={isEditable}
      label={label}
      maxLength={maxLength}
      multiline={multiline}
      showCharacterCount={showCharacterCount}
      placeholder={placeholder}
      icon={icon}
      onBlur={() => {
        field.onBlur();
      }}
      value={field.value}
      onChangeText={value => field.onChange(value)}
      error={fieldState.error}
      isTouched={fieldState.isTouched}
      {...restProps}
    />
  );
}
