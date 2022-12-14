import { useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import PhoneInput from "react-phone-number-input/react-native-input";

import { palette, radii, spacing, typography } from "@/theme/values";
import Typography from "../Typography";

const MobileNumberField = (props: any) => {
  const [isFocused, setIsFocused] = useState(false);

  const {
    placeholder,
    iconLeft,
    label,
    field: { name, onBlur, onChange, value },
    form: { errors, touched, setFieldTouched },
    ...inputProps
  } = props;

  const hasError = errors[name] && touched[name];

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
            onChange={text => onChange(name)(text || "")}
            style={iconLeft ? [styles.text, { marginLeft: 10 }] : styles.text}
            placeholder={placeholder}
            onBlur={handleOnBlur}
            onFocus={handleFocus}
            autoCapitalize="none"
            autoCorrect={false}
            value={value}
            name={name}
            {...inputProps}
          />
        </View>
        {hasError && (
          <Typography.Text color="errorBase" size="caption1" weight="regular">
            {errors[name]}
          </Typography.Text>
        )}
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
  errorView: {
    backgroundColor: palette["errorBase-40"],
    borderColor: palette["errorBase-10"],
  },
  label: {
    marginBottom: spacing.small,
  },
  text: {
    fontSize: typography.text.sizes.callout,
    fontWeight: typography.text.weights.regular,
    lineHeight: typography.text._lineHeights.callout,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    width: "100%",
  },
});
