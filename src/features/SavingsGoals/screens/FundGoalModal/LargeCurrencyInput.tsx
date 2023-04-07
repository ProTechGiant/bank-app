import { useEffect, useRef, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Pressable, StyleSheet, TextInput, TextStyle, View, ViewStyle } from "react-native";

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
  const textInputRef = useRef<TextInput>(null);
  const [fontSize, setFontSize] = useState<"s" | "m" | "l">("l");
  const [isEditable, setIsEditable] = useState(autoFocus);

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

  // "hack" to ensure that cursor will always be at end of text-input
  const handleOnPress = () => {
    setIsEditable(true);
    requestAnimationFrame(() => textInputRef.current?.focus());
  };

  const handleOnBlur = () => {
    field.onBlur();
    setIsEditable(false);
  };

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    marginVertical: theme.spacing["24p"],
  }));

  const textStyles = useThemeStyles<ViewStyle & TextStyle>(
    theme => ({
      color: isError && field.value > 0 ? theme.palette.errorBase : theme.palette.primaryBase,
      fontWeight: theme.typography.text.weights.medium,
      padding: 0,
      margin: 0,
      alignSelf: "center",
    }),
    [isError]
  );

  const helperTextStyles = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const selectionStyles = useThemeStyles<string>(theme => theme.palette.complimentBase, []);

  const currencyStyle = useThemeStyles<TextStyle>(theme => ({
    marginLeft: theme.spacing["4p"],
    marginVertical: theme.spacing["12p"],
  }));

  const largeCurrencyStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["10p"],
  }));

  const mediumCurrencyStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const smallCurrencyStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const inputStyles = useThemeStyles<ViewStyle>(theme => ({
    // width of "SAR" plus the margin-left it has relative to the amount
    paddingLeft: theme.typography.text.sizes.body * 2 + Number(currencyStyle.marginLeft),
    height: 70,
  }));

  return (
    <View style={containerStyles}>
      <Pressable onPress={handleOnPress} style={[styles.container, inputStyles]}>
        <CurrencyInput
          ref={textInputRef}
          autoFocus={autoFocus}
          selectionColor={selectionStyles}
          editable={isEditable}
          onBlur={handleOnBlur}
          onChange={field.onChange}
          onPressIn={handleOnPress}
          maxLength={maxLength}
          style={[
            textStyles,
            fontSize === "s" ? styles.smallText : fontSize === "m" ? styles.mediumText : styles.largeText,
            !field.value && fieldState.error === undefined && styles.disabledOpacity,
          ]}
          value={field.value}
        />
        <View style={styles.buttonContainer}>
          <Typography.Text
            color={isError && field.value > 0 ? "errorBase" : "primaryBase"}
            size="body"
            weight="medium"
            style={[
              currencyStyle,
              fontSize === "s" ? smallCurrencyStyle : fontSize === "m" ? mediumCurrencyStyle : largeCurrencyStyle,
              !field.value && fieldState.error === undefined && styles.disabledOpacity,
            ]}>
            SAR
          </Typography.Text>
        </View>
      </Pressable>
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
  buttonContainer: {
    marginTop: "auto",
  },
  container: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  disabledOpacity: {
    opacity: 0.4,
  },
  largeText: {
    fontSize: 56, // not in core theme
    lineHeight: 67,
  },
  mediumText: {
    fontSize: 38, // not in core theme
    lineHeight: 48,
  },
  smallText: {
    fontSize: 30, // not in core theme
    lineHeight: 34,
  },
});
