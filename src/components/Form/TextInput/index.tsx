import { FieldProps } from "formik";
import { useState } from "react";
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, TextStyle } from "react-native";

import { ErrorIcon } from "@/assets/icons";
import { useThemeStyles } from "@/theme";

import InputBox from "../internal/InputBox";

interface TextInputProps
  extends FieldProps<string | undefined>,
    Omit<RNTextInputProps, "onBlur" | "onChangeText" | "onFocus" | "placeholderTextColor" | "style" | "value"> {
  extra?: React.ComponentProps<typeof InputBox>["extraStart"];
  isEditable?: boolean;
  label?: string;
  showCharacterCount?: boolean;
}

export default function TextInput({
  extra,
  isEditable,
  field,
  meta,
  label,
  maxLength,
  multiline,
  showCharacterCount,
  ...restProps
}: TextInputProps) {
  const textStyles = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette["neutralBase+20"],
      flexGrow: 1,
      lineHeight: theme.typography.text._lineHeights.callout,
      fontSize: theme.typography.text.sizes.callout,
      fontWeight: theme.typography.text.weights.regular,
      padding: 0,
      marginVertical: theme.typography.text.sizes.callout - theme.typography.text._lineHeights.callout - 2,
    }),
    []
  );

  const isError = undefined !== meta?.error && meta?.touched;
  const placeholderTextColor = useThemeStyles(theme => theme.palette.neutralBase, []);
  const errorIconColor = useThemeStyles(theme => theme.palette.errorBase, []);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputBox
      extraStart={extra}
      // eslint-disable-next-line prettier/prettier
      extraEnd={showCharacterCount && undefined !== maxLength ? `${field.value?.length ?? 0} / ${maxLength}` : undefined}
      isEditable={isEditable}
      isFocused={isFocused}
      multiline={multiline}
      meta={meta}
      label={label}>
      <RNTextInput
        editable={isEditable}
        onBlur={() => setIsFocused(false)}
        onChangeText={value => field.onChange({ target: { name: field.name, value } })}
        onFocus={() => setIsFocused(true)}
        maxLength={maxLength}
        multiline={multiline}
        placeholderTextColor={placeholderTextColor}
        style={textStyles}
        value={field.value}
        {...restProps}
      />
      {isError && <ErrorIcon fill={errorIconColor} height={20} width={20} />}
    </InputBox>
  );
}
