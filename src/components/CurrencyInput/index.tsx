/* eslint-disable @typescript-eslint/no-shadow */
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
  maxLength?: number; // maximum number of digits (without fractional part which is always max 2)
  onChange: (value: number) => void;
  value?: number | undefined;
}

export default forwardRef(function MaskedCurrencyInput(
  { maxLength, onBlur, onChange, value, ...restProps }: MaskedCurrencyInputProps,
  ref: ForwardedRef<RNTextInput>
) {
  const [formattedValue, setFormattedValue] = useState(() => (typeof value === "number" ? mask(value) : undefined));
  const lastOutputValue = useRef(value);

  // reset state
  if (value !== lastOutputValue.current) {
    lastOutputValue.current = value;
    setFormattedValue(typeof value === "number" ? mask(value) : undefined);
  }

  const handleOnChangeText = (value_: string) => {
    const value = unmask(value_);
    const numberValue = Number(value.substring(value.length - 1) !== DEC_SEPARATOR ? value : value + "0");

    if (Number.isNaN(numberValue)) {
      setFormattedValue("0");
      return;
    }

    const intValue = Math.floor(numberValue);
    const decimalPosition = value.lastIndexOf(".");

    const decimalSeparatorCount = countDotsInString(value);
    // if current integer part is at max length, only allow fractional digits to be entered
    if (undefined !== maxLength && numberOfDigits(intValue) > maxLength && decimalSeparatorCount === 0) {
      if (undefined !== formattedValue && formattedValue.charAt(formattedValue.length - 1) !== DEC_SEPARATOR) return;
    }

    const fraction = decimalPosition !== -1 ? value.substring(decimalPosition) : "";

    setFormattedValue(mask(intValue) + fraction);

    const outputValue = Math.max(numberValue, 0);
    lastOutputValue.current = outputValue;
    onChange(outputValue);
  };

  let numberOfFractionalDigits = 0;
  // prevent jittering by setting max length at native side when value already has 2 fractional digits
  if (undefined !== formattedValue && formattedValue.includes(DEC_SEPARATOR)) {
    numberOfFractionalDigits = formattedValue.length - formattedValue.lastIndexOf(DEC_SEPARATOR) - 1;
  }

  const handleOnBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    // add a trailing "0" if needed
    if (numberOfFractionalDigits === 1) setFormattedValue(c => c + "0");

    onBlur?.(event);
  };

  // allow maxLength digits PLUS 2 fractional digits
  const numberLength =
    undefined !== maxLength ? maxLength + (maxLength > 3 ? Math.floor(maxLength / 3) : 0) + 3 : undefined;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const resolvedMaxLength = numberOfFractionalDigits === 2 ? formattedValue!.length : numberLength;

  return (
    <RNTextInput
      {...restProps}
      ref={ref}
      inputMode="decimal"
      onBlur={handleOnBlur}
      onChangeText={handleOnChangeText}
      maxLength={resolvedMaxLength}
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

export function countDotsInString(str: string) {
  return str.match(/\./g)?.length || 0;
}

export function numberOfDigits(value: number) {
  return Math.log(value) * Math.LOG10E || 0;
}
