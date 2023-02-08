import { ForwardedRef, forwardRef, useRef, useState } from "react";
import {
  I18nManager,
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputFocusEventData,
  TextInputProps as RNTextInputProps,
} from "react-native";

type RNTextInputProps_ = Omit<
  RNTextInputProps,
  "onChangeText" | "value" | "onChange" | "keyboardType" | "pointerEvents"
>;

export interface MaskedCurrencyInputProps extends RNTextInputProps_ {
  onChange: (value: number) => void;
  value?: number | undefined;
}

export default forwardRef(function MaskedCurrencyInput(
  { onBlur, onChange, value, ...restProps }: MaskedCurrencyInputProps,
  ref: ForwardedRef<RNTextInput>
) {
  const [formattedValue, setFormattedValue] = useState(() => (typeof value === "number" ? mask(value) : undefined));
  const lastOutputValue = useRef(value);

  // reset state
  if (value !== lastOutputValue.current) {
    lastOutputValue.current = value;
    setFormattedValue(typeof value === "number" ? mask(value) : undefined);
  }

  const handleOnChangeText = (value: string) => {
    const rawValue = unmask(value);
    const lastCharacter = rawValue.substring(rawValue.length - 1);
    const endsOnDecimalSep = lastCharacter === DEC_SEPARATOR;
    const numberValue = endsOnDecimalSep ? Number(rawValue.substring(0, rawValue.length - 1)) : Number(rawValue);

    // prevent illegal input
    if (Number.isNaN(numberValue)) return;

    const fractionalDigits = value.includes(DEC_SEPARATOR) ? value.length - value.lastIndexOf(DEC_SEPARATOR) - 1 : 0;
    // do not allow to enter more than 2 fractional digits
    if (fractionalDigits > 2) return;

    // Format value with thousands separators and possibly fractional digits
    const includeTrailingZero = lastCharacter === "0" && rawValue.includes(DEC_SEPARATOR);
    const includeDecimalSep = fractionalDigits !== 2 && (lastCharacter === DEC_SEPARATOR || includeTrailingZero);
    setFormattedValue(mask(numberValue) + (includeDecimalSep ? "." : "") + (includeTrailingZero ? "0" : ""));

    // Return value to parent
    const outputValue = Math.max(numberValue, 0);
    lastOutputValue.current = outputValue;
    onChange(outputValue);
  };

  const handleOnBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    // add a trailing "0" if needed
    if (undefined !== formattedValue && formattedValue.includes(DEC_SEPARATOR)) {
      const fractionalDigits = formattedValue.length - formattedValue.lastIndexOf(DEC_SEPARATOR) - 1;
      if (fractionalDigits < 2) setFormattedValue(c => c + "0");
    }

    onBlur?.(event);
  };

  return (
    <RNTextInput
      {...restProps}
      ref={ref}
      inputMode="numeric"
      onBlur={handleOnBlur}
      onChangeText={handleOnChangeText}
      value={formattedValue}
      pointerEvents="box-only"
      textAlign={I18nManager.isRTL ? "right" : "left"}
    />
  );
});

const TH_SEPARATOR = ",";
const DEC_SEPARATOR = ".";

function mask(number_: number) {
  return number_.toLocaleString("en-US", { style: "decimal" });
}

function unmask(value: string) {
  return value.replaceAll(TH_SEPARATOR, "");
}
