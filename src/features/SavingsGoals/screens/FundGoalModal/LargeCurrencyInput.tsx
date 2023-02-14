import { useEffect, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import CurrencyInput from "@/components/CurrencyInput";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface LargeCurrencyInputProps<T extends FieldValues> {
  autoFocus?: boolean;
  control: Control<T>;
  helperText?: string | ((value: number) => string | undefined);
  maxLength?: number;
  name: Path<T>;
}

export default function LargeCurrencyInput<T extends FieldValues>({
  autoFocus,
  control,
  helperText,
  maxLength,
  name,
}: LargeCurrencyInputProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const [fontSize, setFontSize] = useState<"s" | "m" | "l">("l");

  const isError = undefined !== fieldState.error;
  const errorText = isError ? fieldState.error?.message : undefined;

  const resolvedHelperText = isError
    ? errorText
    : typeof helperText === "function"
    ? helperText(field.value)
    : helperText;

  useEffect(() => {
    field.value !== undefined && String(field.value)?.length > 10
      ? setFontSize("s")
      : field.value !== undefined && String(field.value)?.length > 7
      ? setFontSize("m")
      : setFontSize("l");
  }, [field.value]);

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    marginVertical: theme.spacing["24p"],
  }));

  const inputStyles = useThemeStyles<ViewStyle>(theme => ({
    // width of "SAR" plus the margin-left it has relative to the amount
    paddingLeft: theme.typography.text.sizes.body * 2 + styles.currency.marginLeft,
    height: 70,
  }));

  const textStyles = useThemeStyles<ViewStyle & TextStyle>(
    theme => ({
      color: isError ? theme.palette.errorBase : theme.palette.primaryBase,
      fontWeight: theme.typography.text.weights.medium,
      padding: 0,
      margin: 0,
      alignSelf: "center",
    }),
    [isError, fontSize]
  );

  const helperTextStyles = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  return (
    <View style={containerStyles}>
      <View style={[styles.container, inputStyles]}>
        <CurrencyInput
          autoFocus={autoFocus}
          caretHidden
          onBlur={field.onBlur}
          onChange={field.onChange}
          maxLength={maxLength}
          style={[
            textStyles,
            fontSize === "s" ? styles.smallText : fontSize === "m" ? styles.mediumText : styles.largeText,
          ]}
          value={field.value}
        />
        <Typography.Text
          color={isError ? "errorBase" : "primaryBase"}
          size="body"
          weight="medium"
          style={[
            styles.currency,
            fontSize === "s" ? styles.smallCurrency : fontSize === "m" ? styles.mediumCurrency : styles.largeCurrency,
          ]}>
          SAR
        </Typography.Text>
      </View>
      {undefined !== resolvedHelperText && (
        <Typography.Text
          color={isError ? "errorBase" : "primaryBase"}
          size="body"
          weight="regular"
          style={helperTextStyles}>
          {resolvedHelperText}
        </Typography.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  currency: {
    // not "themeable"
    marginLeft: 4,
    marginVertical: 8,
  },
  largeCurrency: {
    marginTop: 10,
  },
  largeText: {
    fontSize: 56, // not in core theme
    lineHeight: 67,
  },
  mediumCurrency: {
    marginTop: 20,
  },
  mediumText: {
    fontSize: 38, // not in core theme
    lineHeight: 48,
  },
  smallCurrency: {
    marginTop: 17,
  },
  smallText: {
    fontSize: 30, // not in core theme
    lineHeight: 34,
  },
});
