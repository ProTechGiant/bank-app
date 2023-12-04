import { useRef, useState } from "react";
import { Platform, Pressable, TextInput, TextStyle, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import FloatingLabel from "./internal/FloatingLabel";
import InputBox from "./internal/InputBox";
import InputExtra from "./internal/InputExtra";
import { UnstyledCurrencyInput, UnstyledCurrencyInputProps } from "./UnstyledCurrencyInput";

export interface CurrencyInputProps extends Omit<UnstyledCurrencyInputProps, "onChange" | "placeholder" | "value"> {
  currency?: string;
  errorText?: string;
  extraStart?: string;
  isEditable?: boolean;
  onBlur?: () => void;
  onChange?: (value: number) => void;
  placeholder?: string | null;
  label: string;
  showCharacterCount?: boolean;
  maxLength?: number;
  value?: number;
  onClear?: () => void;
}

export function CurrencyInput({
  currency = "SAR",
  errorText,
  extraStart,
  isEditable = true,
  onBlur,
  onChange,
  label,
  maxLength,
  showCharacterCount,
  onClear,
  placeholder,
  value,
  ...restProps
}: CurrencyInputProps) {
  const textInputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleOnBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleOnFocus = () => {
    setIsFocused(true);
    textInputRef.current?.focus();
  };

  const textStyles = useThemeStyles<ViewStyle & TextStyle>(
    theme => ({
      color: isEditable ? theme.palette["neutralBase+30"] : theme.palette["neutralBase-20"],
      fontSize: theme.typography.text.sizes.callout,
      fontWeight: theme.typography.text.weights.regular,
      flexGrow: 1,
      margin: 0,
      padding: 0,
      position: "absolute",
      left: theme.spacing["16p"],
      right: theme.spacing["16p"],
      top: 12,
    }),
    [isEditable]
  );

  const currencyStyle = useThemeStyles<TextStyle>(theme => ({
    position: "absolute",
    left: theme.spacing["16p"],
    right: theme.spacing["16p"],
    top: 12 + (Platform.OS === "android" ? 4 : -2),
  }));

  const elementWidth = value ? String(value).length + 1 : 2;
  const placeholderTextColor = useThemeStyles(theme => theme.palette.neutralBase);

  return (
    <Pressable onPress={handleOnFocus}>
      <InputBox onClear={onClear} value={value} isError={undefined !== errorText} isFocused={isFocused}>
        <FloatingLabel
          containsValue={value !== undefined}
          isEditable={isEditable}
          isFocused={isFocused}
          label={label}
        />
        <UnstyledCurrencyInput
          {...restProps}
          ref={textInputRef}
          editable={isEditable}
          onBlur={handleOnBlur}
          onFocus={handleOnFocus}
          onChange={nextValue => onChange?.(nextValue)}
          maxLength={maxLength}
          placeholderTextColor={placeholderTextColor}
          style={textStyles}
          value={value}
        />
        {value !== undefined ? (
          <Typography.Text
            color="neutralBase+20"
            size="callout"
            style={[currencyStyle, { left: elementWidth * 10 + (currencyStyle.left as number) }]}
            weight="regular">
            {currency}
          </Typography.Text>
        ) : null}
      </InputBox>
      <InputExtra
        errorText={errorText}
        extraStart={extraStart}
        extraEnd={
          showCharacterCount && undefined !== maxLength
            ? `${value?.toString().split(".")[0]?.length ?? 0} / ${maxLength}`
            : undefined
        }
      />
    </Pressable>
  );
}
