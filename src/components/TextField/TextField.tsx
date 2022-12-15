import { useState, createRef } from "react";
import { Keyboard, Pressable, StyleSheet, TextInput, View } from "react-native";

import { Icons } from "@/assets/icons";
import { iconDimensions, palette, radii, spacing, typography } from "@/theme/values";
import Typography from "../Typography";
import { useField } from "formik";

type Props = {
  name: string;
  placeholder: string;
  label?: string;
  keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
  helperText?: string;
  hasCharacterCount?: boolean;
  maxLength?: number;
  numberOfLines?: number;
  multiline?: boolean;
  onChange: () => void;
};

const TextField = ({
  name,
  placeholder,
  label,
  keyboardType = "default",
  helperText,
  hasCharacterCount = false,
  maxLength,
  numberOfLines = 1,
  multiline,
  onChange,
}: Props) => {
  const [field, meta, helper] = useField(name);
  const [isFocused, setIsFocused] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [hasClear, setHasClear] = useState(false);
  const inputRef = createRef<TextInput>();
  const hasError = meta.error && meta.touched;
  const ClearIcon = Icons.Clear;
  const ErrorIcon = Icons.Error;

  let viewStyle;

  if (isFocused) {
    viewStyle = [{ borderColor: palette.complimentBase, borderWidth: 2 }];
  }
  if (hasError) {
    viewStyle = { borderWidth: 2, backgroundColor: palette["errorBase-40"], borderColor: palette["errorBase-10"] };
  }

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    field.onBlur(name);
    helper.setTouched(true);
    setIsFocused(false);
    Keyboard.dismiss();
  };

  const handleClear = () => {
    inputRef.current?.clear();
    setHasClear(false);
    helper.setValue("");
    setCharacterCount(0);
  };

  const textHeight = 24 * numberOfLines;
  const innerViewMinHeight = { height: numberOfLines === 1 ? 54 : textHeight + 32 };

  return (
    <>
      <View>
        {label && (
          <Typography.Text
            size="callout"
            weight="medium"
            color={hasError ? "errorBase" : "neutralBase+30"}
            style={styles.label}>
            {label}
          </Typography.Text>
        )}
        <View style={[styles.innerView, viewStyle, innerViewMinHeight]}>
          <TextInput
            style={[styles.text, { height: textHeight }]}
            placeholder={placeholder}
            onChangeText={text => {
              helper.setValue(text);
              setHasClear(text.length > 0);
              hasCharacterCount && setCharacterCount(text.length);
            }}
            onChange={onChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            autoCapitalize="none"
            autoCorrect={false}
            value={field.value}
            name={field.name}
            keyboardType={keyboardType}
            numberOfLines={numberOfLines}
            multiline={multiline}
            ref={inputRef}
          />
          {hasClear && !hasError && (
            <Pressable
              onPress={handleClear}
              accessibilityLabel="Clear"
              accessibilityRole="button"
              style={styles.inputIcon}>
              <ClearIcon width={iconDimensions.clearIcon} />
            </Pressable>
          )}
          {hasError && (
            <View style={styles.inputIcon}>
              <ErrorIcon width={iconDimensions.clearIcon} />
            </View>
          )}
        </View>
        <View style={styles.errorContainer}>
          {helperText && !hasError && (
            <Typography.Text color="neutralBase" size="caption1">
              {helperText}
            </Typography.Text>
          )}
          {hasError && (
            <Typography.Text color="errorBase" size="caption1" weight="regular">
              {meta.error}
            </Typography.Text>
          )}
          {hasCharacterCount && maxLength && (
            <Typography.Text color={hasError ? "errorBase" : "neutralBase"} size="caption1">
              {characterCount} / {maxLength}
            </Typography.Text>
          )}
        </View>
      </View>
    </>
  );
};

export default TextField;

const styles = StyleSheet.create({
  innerView: {
    alignItems: "flex-start",
    backgroundColor: palette["neutralBase-50"],
    borderColor: palette["neutralBase-20"],
    borderRadius: radii.extraSmall,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 12,
  },
  label: {
    marginBottom: spacing.small,
  },
  inputIcon: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  text: {
    fontSize: typography.text.sizes.callout,
    fontWeight: typography.text.weights.regular,
    lineHeight: typography.text._lineHeights.callout,
    paddingLeft: spacing.medium,
    paddingRight: 42,
    paddingVertical: 0,
  },
  errorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingHorizontal: spacing.medium,
  },
});
