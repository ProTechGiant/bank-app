import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { I18nManager, TextInput as RNTextInput, TextInputProps as RNTextInputProps, TextStyle } from "react-native";

import { useThemeStyles } from "@/theme";

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
  ...restProps
}: TextInputProps<T>) {
  const { field, fieldState } = useController({ control, name });

  const textStyles = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette["neutralBase+20"],
    flexGrow: 1,
    fontSize: theme.typography.text.sizes.callout,
    fontWeight: theme.typography.text.weights.regular,
    padding: 0,
  }));

  const placeholderTextColor = useThemeStyles(theme => theme.palette.neutralBase, []);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputBox
      extraStart={extra}
      extraEnd={
        showCharacterCount && undefined !== maxLength ? `${field.value?.length ?? 0} / ${maxLength}` : undefined
      }
      isEditable={isEditable}
      isFocused={isFocused}
      multiline={multiline}
      fieldState={fieldState}
      label={label}>
      <RNTextInput
        editable={isEditable}
        onBlur={() => {
          field.onBlur();
          setIsFocused(false);
        }}
        onChangeText={value => field.onChange(value)}
        onFocus={() => setIsFocused(true)}
        maxLength={maxLength}
        multiline={multiline}
        placeholder={placeholder ?? undefined}
        placeholderTextColor={placeholderTextColor}
        style={[textStyles, undefined !== fieldState.error && fieldState.isTouched && { maxWidth: "92%" }]}
        value={field.value}
        textAlign={I18nManager.isRTL ? "right" : "left"}
        {...restProps}
      />
    </InputBox>
  );
}
