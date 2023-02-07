import { useRef, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import {
  I18nManager,
  Platform,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TextStyle,
  View,
} from "react-native";

import { useThemeStyles } from "@/theme";

import Typography from "../Typography";
import InputBox from "./internal/InputBox";

interface CurrencyInputProps<T extends FieldValues>
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
}

export default function CurrencyInput<T extends FieldValues>({
  control,
  extra,
  isEditable,
  label,
  name,
  placeholder,
  ...restProps
}: CurrencyInputProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const textInputRef = useRef<RNTextInput>(null);

  // eslint-disable-next-line prettier/prettier
  const [currentValue, setCurrentValue] = useState(() => typeof field.value === "number" ? mask(field.value) : undefined);
  const [isFocused, setIsFocused] = useState(false);

  const handleOnChangeText = (value: string) => {
    const rawValue = unmask(value);
    const lastCharacter = rawValue.substring(rawValue.length - 1);
    const endsOnDecimalSep = lastCharacter === DEC_SEPARATOR;
    const numberValue = endsOnDecimalSep ? Number(rawValue.substring(0, rawValue.length - 1)) : Number(rawValue);

    // prevent illegal input
    if (Number.isNaN(numberValue)) return;

    const fractionalDigits = value.includes(DEC_SEPARATOR) ? value.length - value.lastIndexOf(DEC_SEPARATOR) - 1 : 0;
    const includeTrailingZero = lastCharacter === "0" && rawValue.includes(DEC_SEPARATOR);
    const includeDecimalSep = fractionalDigits !== 2 && (lastCharacter === DEC_SEPARATOR || includeTrailingZero);

    // do not allow to enter more than 2 fractional digits
    if (fractionalDigits > 2) return;

    setCurrentValue(mask(numberValue) + (includeDecimalSep ? "." : "") + (includeTrailingZero ? "0" : ""));
    field.onChange(numberValue > 0 ? numberValue : undefined);

    console.log({
      rawValue,
      lastCharacter,
      endsOnDecimalSep,
      numberValue,
      includeDecimalSep,
      includeTrailingZero,
      fractionalDigits,
    });
  };

  const handleOnBlur = () => {
    field.onBlur();
    setIsFocused(false);

    // add trailing "0" if needed
    if (undefined === currentValue || !currentValue.includes(DEC_SEPARATOR)) return;
    const fractionalDigits = currentValue.length - currentValue.lastIndexOf(DEC_SEPARATOR) - 1;
    if (fractionalDigits < 2) setCurrentValue(c => c + "0");
  };

  let textStyles = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette["neutralBase+20"],
    flexGrow: 1,
    fontSize: theme.typography.text.sizes.callout,
    fontWeight: theme.typography.text.weights.regular,
    padding: 0,
  }));

  if (Platform.OS === "web") {
    const elementWidth = currentValue ? unmask(currentValue).length + 1 : 10;
    const webTextStyles = { width: elementWidth + "ch" };
    textStyles = { ...textStyles, ...webTextStyles };
  }

  const placeholderTextColor = useThemeStyles(theme => theme.palette.neutralBase);

  return (
    <InputBox
      extraStart={extra}
      // need to have an `onPress` handler because the innerContainer prevents TextInput from capturing full width
      onPress={() => textInputRef.current?.focus()}
      isEditable={isEditable}
      isFocused={isFocused}
      fieldState={fieldState}
      label={label}>
      <View style={styles.innerContainer}>
        <RNTextInput
          ref={textInputRef}
          keyboardType="numeric"
          editable={isEditable}
          onBlur={handleOnBlur}
          onChangeText={handleOnChangeText}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder ?? undefined}
          placeholderTextColor={placeholderTextColor}
          style={textStyles}
          value={currentValue}
          textAlign={I18nManager.isRTL ? "right" : "left"}
          {...restProps}
        />
        {!!field.value && (
          <Typography.Text color="neutralBase+20" size="callout" style={styles.currency} weight="regular">
            SAR
          </Typography.Text>
        )}
      </View>
    </InputBox>
  );
}

const TH_SEPARATOR = ",";
const DEC_SEPARATOR = ".";

function mask(number_: number) {
  return number_.toLocaleString("en-US", { style: "decimal" });
}

function unmask(value: string) {
  return value.replaceAll(TH_SEPARATOR, "");
}

const styles = StyleSheet.create({
  currency: {
    marginLeft: Platform.OS === "web" ? undefined : 4,
    marginTop: Platform.OS === "web" ? undefined : -StyleSheet.hairlineWidth * 2,
  },
  innerContainer: {
    alignItems: "center",
    flexDirection: "row",
    flexGrow: 0,
  },
});
