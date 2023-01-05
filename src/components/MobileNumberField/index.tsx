import { createRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import { DefaultInputComponentProps, FeatureProps } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input/react-native-input";

import { ClearIcon, ErrorIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

const MobileNumberField = ({
  placeholder,
  iconLeft,
  label,
  field: { name, onBlur, onChange, value },
  form: { errors, touched, setFieldTouched },
  ...inputProps
}: FeatureProps<DefaultInputComponentProps>) => {
  const innerViewStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      backgroundColor: theme.palette["neutralBase-50"],
      borderColor: theme.palette["neutralBase-20"],
      borderRadius: theme.radii.extraSmall,
      borderWidth: 1,
      flexDirection: "row",
      height: 54,
      justifyContent: "flex-start",
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
      paddingVertical: theme.spacing.small,
      width: "100%",
    }),
    []
  );
  const errorContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing.medium,
      marginTop: 4,
    }),
    []
  );
  const labelStyleStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing.small,
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
  const isFocusedStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderColor: theme.palette.complimentBase,
      borderWidth: 2,
    }),
    []
  );
  const hasErrorStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderWidth: 2,
      backgroundColor: theme.palette["errorBase-40"],
      borderColor: theme.palette["errorBase-10"],
    }),
    []
  );

  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.clearIcon, []);

  const [isFocused, setIsFocused] = useState(false);
  const [hasClear, setHasClear] = useState(false);

  const hasError = errors[name] && touched[name];
  const inputRef = createRef<TextInput>();

  let viewStyle;

  if (isFocused) {
    viewStyle = [isFocusedStyle];
  }
  if (hasError) {
    viewStyle = hasErrorStyle;
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
            style={labelStyleStyle}>
            {label}
          </Typography.Text>
        )}
        <View style={[innerViewStyle, viewStyle]}>
          {iconLeft && <View style={styles.icon}>{iconLeft}</View>}
          <PhoneInput
            international
            country="SA"
            onChange={text => {
              onChange(name)(text || "");
              setHasClear(text !== undefined && text.length > 0);
            }}
            style={iconLeft ? [textStyle, { marginLeft: 10 }] : textStyle}
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
});
