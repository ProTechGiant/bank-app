import { createRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, TextInput, View } from "react-native";
import PhoneInput from "react-phone-number-input/react-native-input";
import { FeatureProps, DefaultInputComponentProps } from "react-phone-number-input";

import { ClearIcon, ErrorIcon } from "@/assets/icons";
import { iconDimensions, palette, radii, spacing, typography } from "@/theme/values";
import Typography from "@/components/Typography";

const MobileNumberField = ({
  placeholder,
  iconLeft,
  label,
  field: { name, onBlur, onChange, value },
  form: { errors, touched, setFieldTouched },
  ...inputProps
}: FeatureProps<DefaultInputComponentProps>) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasClear, setHasClear] = useState(false);

  const hasError = errors[name] && touched[name];
  const inputRef = createRef<TextInput>();

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

  const handleOnBlur = () => {
    setFieldTouched(name);
    onBlur(name);
    setIsFocused(false);
    Keyboard.dismiss();
  };

  const handleClear = () => {
    inputRef.current?.clear();
    setHasClear(false);
  };

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
        <View style={[styles.innerView, viewStyle]}>
          {iconLeft && <View style={styles.icon}>{iconLeft}</View>}
          <PhoneInput
            international
            country="SA"
            onChange={text => {
              onChange(name)(text || "");
              setHasClear(text !== undefined && text.length > 0);
            }}
            style={iconLeft ? [styles.text, { marginLeft: 10 }] : styles.text}
            placeholder={placeholder}
            onBlur={handleOnBlur}
            onFocus={handleFocus}
            autoCapitalize="none"
            autoCorrect={false}
            value={value}
            name={name}
            ref={inputRef}
            {...inputProps}
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
          {hasError && (
            <Typography.Text color="errorBase" size="caption1" weight="regular">
              {errors[name]}
            </Typography.Text>
          )}
        </View>
      </View>
    </>
  );
};

export default MobileNumberField;

const styles = StyleSheet.create({
  icon: {
    marginLeft: 7,
  },
  innerView: {
    alignItems: "center",
    backgroundColor: palette["neutralBase-50"],
    borderColor: palette["neutralBase-20"],
    borderRadius: radii.extraSmall,
    borderWidth: 1,
    flexDirection: "row",
    height: 54,
    justifyContent: "flex-start",
  },
  errorContainer: {
    paddingHorizontal: spacing.medium,
    marginTop: 4,
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
    paddingVertical: spacing.small,
    width: "100%",
  },
});
