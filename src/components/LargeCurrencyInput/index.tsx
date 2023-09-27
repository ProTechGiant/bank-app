/* eslint-disable react/jsx-handler-names */
import { useEffect, useRef, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Pressable, ReturnKeyTypeOptions, StyleSheet, TextInput, TextStyle, View, ViewStyle } from "react-native";

import { UnstyledCurrencyInput } from "@/components/Input";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface LargeCurrencyInputProps<T extends FieldValues> {
  autoFocus?: boolean;
  control: Control<T>;
  helperText?: (value: number) => string | undefined;
  maxLength?: number;
  name: Path<T>;
  returnKeyType?: ReturnKeyTypeOptions;
  isAmountExceedsBalance?: boolean;
  testID?: string;
  currency?: string;
  question?: string;
  size?: "title1" | "title2" | "title3";
}

export default function LargeCurrencyInput<T extends FieldValues>({
  autoFocus,
  control,
  maxLength,
  name,
  returnKeyType,
  currency,
  testID,
  size,
  question,
}: LargeCurrencyInputProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const textInputRef = useRef<TextInput>(null);
  const [fontSize, setFontSize] = useState<"s" | "m" | "l">("l");
  const [isEditable, setIsEditable] = useState(autoFocus);

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
    justifyContent: "center",
    marginVertical: theme.spacing["4p"],
  }));

  const textStyles = useThemeStyles<ViewStyle & TextStyle>(theme => ({
    color: theme.palette.primaryBase,
    fontWeight: theme.typography.text.weights.medium,
    padding: 0,
    margin: 0,
    alignSelf: "center",
  }));

  const selectionStyles = useThemeStyles<string>(theme => theme.palette.complimentBase, []);

  const currencyStyle = useThemeStyles<TextStyle>(theme => ({
    marginLeft: theme.spacing["4p"],
    marginVertical: theme.spacing["12p"],
    transform: [{ translateY: 10 }],
  }));

  const largeCurrencyStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["12p"],
  }));

  const mediumCurrencyStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const smallCurrencyStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  return (
    <View style={containerStyles}>
      <Typography.Text size={size} weight="medium">
        {question}
      </Typography.Text>
      <Pressable onPress={handleOnPress} style={[styles.container, styles.inputStyles]}>
        <UnstyledCurrencyInput
          ref={textInputRef}
          autoFocus={autoFocus}
          selectionColor={selectionStyles}
          editable={isEditable}
          onBlur={handleOnBlur}
          onChange={field.onChange}
          onPressIn={handleOnPress}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          style={[
            textStyles,
            fontSize === "s" ? styles.smallText : fontSize === "m" ? styles.mediumText : styles.largeText,
            !field.value && fieldState.error === undefined && styles.disabledOpacity,
          ]}
          testID={testID}
          value={field.value}
        />
        <View style={styles.buttonContainer}>
          <Typography.Text
            color="primaryBase"
            size="title1"
            weight="medium"
            style={[
              currencyStyle,
              fontSize === "s" ? smallCurrencyStyle : fontSize === "m" ? mediumCurrencyStyle : largeCurrencyStyle,
              !field.value && fieldState.error === undefined && styles.disabledOpacity,
            ]}>
            {currency}
          </Typography.Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: "100%",
    marginTop: "auto",
  },
  container: {
    alignItems: "flex-start",
    flexDirection: "row",
    marginTop: 24,
  },
  disabledOpacity: {
    opacity: 0.4,
  },
  inputStyles: {
    height: 70,
  },
  largeText: {
    fontSize: 64,
    lineHeight: 67,
  },
  mediumText: {
    fontSize: 56,
    lineHeight: 67,
  },
  smallText: {
    fontSize: 30,
    lineHeight: 67,
  },
});
