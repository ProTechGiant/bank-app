import { useRef, useState } from "react";
import {
  I18nManager,
  Platform,
  Pressable,
  StyleSheet,
  TextInput as RNTextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { useMaskedInputProps } from "react-native-mask-input";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { useThemeStyles } from "@/theme";

import FloatingLabel from "./internal/FloatingLabel";
import InputBox from "./internal/InputBox";
import InputExtra from "./internal/InputExtra";

export interface PhoneNumberInputProps {
  countryCode?: "+966";
  errorText?: string;
  isEditable?: boolean;
  onBlur?: () => void;
  onChangeText?: (value: string) => void;
  onFocus?: () => void;
  label: string;
  testID?: string;
  value?: string;
  onClear?: () => void;
  doneButtonOnFoucs?: () => void;
  doneButtonOnBlur?: () => void;
  onContactPress?: () => void;
  onboarding: boolean;
}

export function PhoneNumberInput({
  countryCode = "+966",
  errorText,
  isEditable = true,
  onBlur,
  onChangeText: propsOnChangeText,
  onFocus,
  label,
  testID,
  value: propsValue,
  onClear,
  doneButtonOnFoucs,
  doneButtonOnBlur,
  onContactPress,
}: PhoneNumberInputProps) {
  const textInputRef = useRef<RNTextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const filteredValue = propsValue?.startsWith(countryCode) ? propsValue.substring(countryCode.length) : propsValue;
  const containsValue = filteredValue !== undefined && filteredValue.length > 0;
  const actualMaxLength = COUNTRY_CONFIGURATION[countryCode].length;

  const { onChangeText, placeholder, value } = useMaskedInputProps({
    value: filteredValue,
    onChangeText: (_masked, unmasked) => {
      const countryCodeWithoutSign = countryCode.substring(1);
      const startsWithCountryCode = unmasked.startsWith(countryCodeWithoutSign);
      const extractedValue = startsWithCountryCode ? unmasked.slice(countryCodeWithoutSign.length) : unmasked;
      propsOnChangeText?.(countryCode + extractedValue);
    },
    mask: COUNTRY_CONFIGURATION[countryCode],
    maskAutoComplete: true,
    placeholderFillCharacter: "X",
  });

  const handleOnFocus = () => {
    setIsFocused(true);
    doneButtonOnFoucs?.();
    textInputRef.current?.focus();
    onFocus?.();
  };

  const handleOnBlur = () => {
    setIsFocused(false);
    doneButtonOnBlur?.();
    onBlur?.();
  };

  const textInputStyle = useThemeStyles<ViewStyle & TextStyle>(
    theme => ({
      color: isEditable ? theme.palette["neutralBase+30"] : theme.palette["neutralBase-20"],
      fontSize: theme.typography.text.sizes.callout,
      fontWeight: theme.typography.text.weights.regular,
      flexGrow: 1,
      margin: 0,
      padding: 0,
      position: "absolute",
      left: !I18nManager.isRTL ? theme.spacing["16p"] + 44 : theme.spacing["16p"],
      right: I18nManager.isRTL ? theme.spacing["16p"] + 44 : theme.spacing["16p"],
      top: 25 - (Platform.OS === "android" ? 3.5 : 0),
    }),
    [isEditable]
  );

  const countryCodeStyle = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette["neutralBase+30"],
    fontSize: theme.typography.text.sizes.callout,
    fontWeight: theme.typography.text.weights.regular,
    position: "absolute",
    left: !I18nManager.isRTL ? theme.spacing["16p"] : undefined,
    right: I18nManager.isRTL ? theme.spacing["16p"] : undefined,
    top: 24.5,
  }));

  const animatedContentStyle = useAnimatedStyle(
    () => ({
      ...StyleSheet.absoluteFillObject,
      opacity: isFocused || containsValue ? 1 : 0,
      flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    }),
    [isFocused, containsValue]
  );

  const placeholderTextColor = useThemeStyles(theme => theme.palette["neutralBase-10"]);

  return (
    <View>
      <Pressable onPress={() => handleOnFocus()} testID={testID !== undefined ? `${testID}->InputBox` : undefined}>
        <InputBox
          onContactPress={onContactPress}
          onClear={onClear}
          value={value}
          isError={isFocused ? false : undefined !== errorText}
          isFocused={isFocused}
          numberOfLines={1}>
          <FloatingLabel containsValue={containsValue} isEditable={isEditable} isFocused={isFocused} label={label} />
          <Animated.View style={animatedContentStyle}>
            <Animated.Text style={countryCodeStyle}>{countryCode}</Animated.Text>
            <RNTextInput
              placeholderTextColor={placeholderTextColor}
              accessibilityLabel={label}
              autoCorrect={false}
              autoComplete="off"
              editable={isEditable}
              ref={textInputRef}
              inputMode="tel"
              onBlur={() => handleOnBlur()}
              onChangeText={onChangeText}
              onFocus={() => handleOnFocus()}
              placeholder={placeholder}
              maxLength={actualMaxLength}
              numberOfLines={1}
              style={textInputStyle}
              testID={testID}
              textAlign={I18nManager.isRTL ? "right" : "left"}
              value={value}
              keyboardType="number-pad"
            />
          </Animated.View>
        </InputBox>
      </Pressable>
      {!isFocused ? <InputExtra errorText={errorText} testID={testID} /> : null}
    </View>
  );
}

const COUNTRY_CONFIGURATION = {
  "+966": [
    /^[\d\u0660-\u0669\u06F0-\u06F9]+$/,
    /^[\d\u0660-\u0669\u06F0-\u06F9]+$/,
    " ",
    /^[\d\u0660-\u0669\u06F0-\u06F9]+$/,
    /^[\d\u0660-\u0669\u06F0-\u06F9]+$/,
    /^[\d\u0660-\u0669\u06F0-\u06F9]+$/,
    " ",
    /^[\d\u0660-\u0669\u06F0-\u06F9]+$/,
    /^[\d\u0660-\u0669\u06F0-\u06F9]+$/,
    /^[\d\u0660-\u0669\u06F0-\u06F9]+$/,
    /^[\d\u0660-\u0669\u06F0-\u06F9]+$/,
  ],
};
