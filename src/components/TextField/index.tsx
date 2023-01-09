import { useField } from "formik";
import { createRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, TextInput, View, ViewStyle } from "react-native";

import { ClearIcon, ErrorIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

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
  blurOnSubmit?: boolean;
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
  onChange?: () => void;
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
  blurOnSubmit,
  returnKeyType,
  onChange,
}: Props) => {
  const errorContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 4,
      paddingHorizontal: theme.spacing.medium,
    }),
    []
  );
  const innerViewStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "flex-start",
      backgroundColor: theme.palette["neutralBase-50"],
      borderColor: theme.palette["neutralBase-20"],
      borderRadius: theme.radii.extraSmall,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "flex-start",
      paddingVertical: 12,
    }),
    []
  );
  const textStyle = useThemeStyles<ViewStyle>(
    theme => ({
      fontSize: theme.typography.text.sizes.callout,
      fontWeight: theme.typography.text.weights.regular,
      lineHeight: theme.typography.text._lineHeights.callout,
      paddingLeft: theme.spacing.medium,
      paddingRight: 42,
      paddingVertical: 0,
    }),
    []
  );
  const inputIconStyle = useThemeStyles<ViewStyle>(
    theme => ({
      position: "absolute",
      right: theme.spacing.medium,
      top: theme.spacing.medium,
    }),
    []
  );
  const labelStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing.small,
    }),
    []
  );
  const errorStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderWidth: 2,
      backgroundColor: theme.palette["errorBase-40"],
      borderColor: theme.palette["errorBase-10"],
    }),
    []
  );
  const focusedStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderColor: theme.palette.complimentBase,
      borderWidth: 2,
    }),
    []
  );
  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.clearIcon, []);

  const [field, meta, helper] = useField(name);
  const [isFocused, setIsFocused] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [hasClear, setHasClear] = useState(false);
  const inputRef = createRef<TextInput>();
  const hasError = meta.error && meta.touched;

  let viewStyle;

  if (isFocused) {
    viewStyle = [focusedStyle];
  }
  if (hasError) {
    viewStyle = errorStyle;
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
          <Typography.Text size="callout" weight="medium" color="neutralBase+30" style={labelStyle}>
            {label}
          </Typography.Text>
        )}
        <View style={[innerViewStyle, viewStyle, innerViewMinHeight]}>
          <TextInput
            style={[textStyle, { height: textHeight }]}
            placeholder={placeholder}
            onChangeText={text => {
              helper.setValue(text);
              setHasClear(text.length > 0);
              hasCharacterCount && setCharacterCount(text.length);
            }}
            blurOnSubmit={blurOnSubmit}
            onChange={onChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            autoCapitalize="none"
            autoCorrect={false}
            value={field.value}
            name={field.name}
            keyboardType={keyboardType}
            numberOfLines={numberOfLines}
            maxLength={maxLength}
            multiline={multiline}
            ref={inputRef}
            returnKeyType={returnKeyType}
          />
          {hasClear && !hasError && (
            <Pressable
              onPress={handleClear}
              accessibilityLabel="Clear"
              accessibilityRole="button"
              style={inputIconStyle}>
              <ClearIcon width={iconDimensions} />
            </Pressable>
          )}
          {hasError && (
            <View style={inputIconStyle}>
              <ErrorIcon width={iconDimensions} />
            </View>
          )}
        </View>
        <View style={errorContainerStyle}>
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
            <View style={styles.characterCount}>
              <Typography.Text color={hasError ? "errorBase" : "neutralBase"} size="caption1">
                {characterCount} / {maxLength}
              </Typography.Text>
            </View>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  characterCount: {
    marginLeft: "auto",
  },
});

export default TextField;
