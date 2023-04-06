import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { I18nManager, TextStyle } from "react-native";
import PhoneInput from "react-phone-number-input/react-native-input";

import { useThemeStyles } from "@/theme";
import { mobilePhoneNoCountryCodeLength } from "@/utils";

import InputBox from "./internal/InputBox";

interface PhoneNumberInputProps<T extends FieldValues> {
  control: Control<T>;
  extra?: React.ComponentProps<typeof InputBox>["extraStart"];
  isEditable?: boolean;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  showCharacterCount?: boolean;
  maxLength: number;
}

export default function PhoneNumberInput<T extends FieldValues>({
  control,
  extra,
  isEditable,
  name,
  label,
  placeholder,
  showCharacterCount,
  maxLength,
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
    <InputBox
      extraStart={extra}
      isEditable={isEditable}
      isFocused={isFocused}
      label={label}
      extraEnd={
        showCharacterCount && undefined !== maxLength
          ? `${mobilePhoneNoCountryCodeLength(COUNTRY_CODE, field.value)} / ${maxLength}`
          : undefined
      }
      isTouched={fieldState.isTouched}
      error={fieldState.error}>
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
        country={COUNTRY_CODE}
        maxLength={
          maxLength <= mobilePhoneNoCountryCodeLength(COUNTRY_CODE, field.value)
            ? maxLength
            : maxLength + SPACE_IN_PHONE_NUMBER
        }
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={textStyles}
        value={field.value}
        textAlign={I18nManager.isRTL ? "right" : "left"}
      />
    </InputBox>
  );
}

const COUNTRY_CODE = "SA";
const SPACE_IN_PHONE_NUMBER = 2;
