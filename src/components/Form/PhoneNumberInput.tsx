import { useEffect, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { I18nManager, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import PhoneInput from "react-phone-number-input/react-native-input";

import { useThemeStyles } from "@/theme";
import { mobilePhoneNoCountryCodeLength } from "@/utils";

import Typography from "../Typography";
import InputBox from "./internal/InputBox";
import InputExtra from "./internal/InputExtra";
import InputLabel from "./internal/InputLabel";

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
  const isError = undefined !== fieldState?.error && fieldState.isTouched;

  const [maskedMaxLength, setMaskedMaxLength] = useState(maxLength + SPACE_IN_PHONE_NUMBER);

  useEffect(() => {
    // add delay to fix for android
    setTimeout(() => {
      setMaskedMaxLength(
        maxLength <= mobilePhoneNoCountryCodeLength(COUNTRY_CODE, field.value)
          ? maxLength
          : maxLength + SPACE_IN_PHONE_NUMBER
      );
    }, 50);
  }, [field.value]);

  const textStyles = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette["neutralBase+20"],
    flexGrow: 1,
    fontSize: theme.typography.text.sizes.callout,
    fontWeight: theme.typography.text.weights.regular,
    padding: 0,
  }));

  const areaCodeViewStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-50"],
    borderColor: theme.palette["neutralBase-20"],
    borderRadius: theme.radii.extraSmall,
    borderWidth: 1,
    flexDirection: "row",
    height: 54,
    justifyContent: "center",
    paddingHorizontal: theme.spacing["16p"],
    marginRight: theme.spacing["12p"],
  }));

  const errorsMobileNumberStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 2,
    borderColor: theme.palette.errorBase,
  }));

  const placeholderTextColor = useThemeStyles(theme => theme.palette.neutralBase);

  return (
    <View>
      {label ? <InputLabel>{label}</InputLabel> : null}
      <View style={styles.fieldsContainer}>
        <View style={[areaCodeViewStyle, isError && errorsMobileNumberStyle]}>
          <Typography.Text size="callout" color="neutralBase">
            +966
          </Typography.Text>
        </View>
        <InputBox
          hideExtra
          isEditable={isEditable}
          isFocused={isFocused}
          isTouched={fieldState.isTouched}
          error={fieldState.error}>
          <PhoneInput
            autoCapitalizeMob="none"
            autoCorrect={false}
            onBlur={() => {
              setIsFocused(false);
              field.onBlur();
            }}
            onChange={value => field.onChange(value)}
            onFocus={() => setIsFocused(true)}
            international
            country={COUNTRY_CODE}
            maxLength={maskedMaxLength}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            style={textStyles}
            value={field.value}
            textAlign={I18nManager.isRTL ? "right" : "left"}
          />
        </InputBox>
      </View>
      <InputExtra
        extraStart={extra}
        extraEnd={
          showCharacterCount && undefined !== maxLength
            ? `${mobilePhoneNoCountryCodeLength(COUNTRY_CODE, field.value)} / ${maxLength}`
            : undefined
        }
        error={fieldState.error}
        isError={isError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fieldsContainer: {
    flexDirection: "row",
  },
});

const COUNTRY_CODE = "SA";
const SPACE_IN_PHONE_NUMBER = 2;
