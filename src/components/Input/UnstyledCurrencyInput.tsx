import { toString } from "lodash";
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

export interface UnstyledCurrencyInputProps extends RNTextInputProps_ {
  maxLength?: number; // maximum number of digits (without fractional part which is always max 2)
  onChange: (value: number) => void;
  value?: number;
}

const UnstyledCurrencyInput = forwardRef(function (
  { maxLength, onBlur, onChange, value, ...restProps }: UnstyledCurrencyInputProps,
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
    if (value_ === "") {
      setFormattedValue(undefined);
      return;
    }
    const changedValue = unmask(value_);
    const numberValue = Number(
      changedValue.substring(changedValue.length - 1) !== DEC_SEPARATOR ? changedValue : changedValue + "0"
    );

    if (Number.isNaN(numberValue)) {
      setFormattedValue("0");
      return;
    }

    const intValue = Math.floor(numberValue);
    const decimalPosition = changedValue.lastIndexOf(".");

    const decimalSeparatorCount = countDotsInString(changedValue);
    // if current integer part is at max length, only allow fractional digits to be entered
    if (undefined !== maxLength && numberOfDigits(intValue) > maxLength && decimalSeparatorCount === 0) {
      if (undefined !== formattedValue && formattedValue.charAt(formattedValue.length - 1) !== DEC_SEPARATOR) return;
    }

    const fraction = decimalPosition !== -1 ? changedValue.substring(decimalPosition) : "";

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

  const hasFractionRegx = /\.\d{2}/;

  return (
    <RNTextInput
      {...restProps}
      ref={ref}
      inputMode="decimal"
      onBlur={handleOnBlur}
      onChangeText={handleOnChangeText}
      maxLength={!hasFractionRegx.test(toString(formattedValue)) ? resolvedMaxLength - 3 : resolvedMaxLength}
      value={formattedValue}
      placeholder="0"
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

export { UnstyledCurrencyInput };
