import { useState } from "react";
import { I18nManager, TextInput as RNTextInput, TextInputProps as RNTextInputProps, TextStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import InputBox from "../Form/internal/InputBox";

type RNTextInputProps_ = Omit<RNTextInputProps, "onFocus" | "placeholderTextColor" | "placeholder" | "style">;

interface TextInputProps extends RNTextInputProps_ {
  extra?: React.ComponentProps<typeof InputBox>["extraStart"];
  isEditable?: boolean;
  placeholder?: string | null | undefined;
  label?: string | null;
  showCharacterCount?: boolean;
  icon?: React.ReactElement;
  error?: { type: string; message?: string };
  isTouched: boolean;
  numberOfLines?: number;
}

export default function TextInput({
  extra,
  isEditable,
  label,
  maxLength,
  multiline,
  showCharacterCount,
  placeholder,
  icon,
  onBlur,
  value,
  onChangeText,
  error,
  isTouched,
  numberOfLines,
  ...restProps
}: TextInputProps) {
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
      extraEnd={showCharacterCount && undefined !== maxLength ? `${value?.length ?? 0} / ${maxLength}` : undefined}
      isEditable={isEditable}
      isFocused={isFocused}
      multiline={multiline}
      numberOfLines={numberOfLines}
      error={error}
      isTouched={isTouched}
      label={label}
      icon={icon}>
      <RNTextInput
        editable={isEditable}
        onBlur={e => {
          onBlur && onBlur(e);
          setIsFocused(false);
        }}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholder={placeholder ?? undefined}
        placeholderTextColor={placeholderTextColor}
        style={[textStyles, undefined !== error && isTouched && { maxWidth: "92%" }]}
        value={value}
        textAlign={I18nManager.isRTL ? "right" : "left"}
        {...restProps}
      />
    </InputBox>
  );
}
