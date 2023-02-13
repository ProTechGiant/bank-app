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

    // validate input
    if (Number.isNaN(numberValue) || countDotsInString(value) > 1) return;

    const intValue = Math.floor(numberValue);
    const decimalPosition = value.lastIndexOf(".");

    const fraction = -1 !== decimalPosition ? value.substring(decimalPosition) : "";
    if (fraction.length > 3) return;

    setFormattedValue(mask(intValue) + fraction);

    const outputValue = Math.max(numberValue, 0);
    lastOutputValue.current = outputValue;
    onChange(outputValue);
  };

  const handleOnBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    // add a trailing "0" if needed
    if (numberOfFractionalDigits < 2) setFormattedValue(c => c + "0");

    onBlur?.(event);
  };

  let numberOfFractionalDigits = 0;
  if (undefined !== formattedValue && formattedValue.includes(DEC_SEPARATOR)) {
    numberOfFractionalDigits = formattedValue.length - formattedValue.lastIndexOf(DEC_SEPARATOR) - 1;
  }

  return (
    <RNTextInput
      {...restProps}
      ref={ref}
      inputMode="decimal"
      onBlur={handleOnBlur}
      onChangeText={handleOnChangeText}
      // prevent jittering by setting max length at native side when value already has 2 fractional digits
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      maxLength={numberOfFractionalDigits == 2 ? formattedValue!.length : maxLength}
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
