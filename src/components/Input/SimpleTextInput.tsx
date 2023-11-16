import { useRef, useState } from "react";
import { I18nManager, Platform, Pressable, TextInput as RNTextInput, TextStyle, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import FloatingLabel from "./internal/FloatingLabel";
import InputBox from "./internal/InputBox";
import InputExtra from "./internal/InputExtra";
import { TextInputProps } from "./TextInput";

export default function SimpleTextInput({
  errorText,
  extraStart,
  isEditable = true,
  onBlur,
  onFocus,
  label,
  maxLength,
  multiline = false,
  numberOfLines = 1,
  placeholder,
  showCharacterCount = false,
  testID,
  value,
  ...restProps
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textInputRef = useRef<RNTextInput>(null);
  const containsValue = value !== undefined && value.length > 0;

  const handleOnFocus = () => {
    setIsFocused(true);

    textInputRef.current?.focus();
    onFocus?.();
  };

  const handleOnBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const textInputStyle = useThemeStyles<ViewStyle & TextStyle>(
    t => ({
      color: isEditable ? t.palette["neutralBase+30"] : t.palette["neutralBase-20"],
      fontSize: t.typography.text.sizes.callout,
      fontWeight: t.typography.text.weights.regular,
      margin: 0,
      padding: 0,
      position: "absolute",
      left: t.spacing["16p"],
      width: "100%",
      top: 25 - (multiline === true ? 5 : 0) - (Platform.OS === "android" ? 3.5 : 0),
    }),
    [isEditable, multiline]
  );

  return (
    <Pressable onPress={() => handleOnFocus()}>
      <InputBox isError={undefined !== errorText} isFocused={isFocused} numberOfLines={numberOfLines}>
        <FloatingLabel containsValue={containsValue} isEditable={isEditable} isFocused={isFocused} label={label} />
        <RNTextInput
          {...restProps}
          ref={textInputRef}
          accessibilityLabel={label}
          editable={isEditable}
          onBlur={() => handleOnBlur()}
          onFocus={() => handleOnFocus()}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          placeholder={isFocused ? placeholder : undefined}
          style={textInputStyle}
          testID={testID}
          textAlign={I18nManager.isRTL ? "right" : "left"}
          value={value}
        />
      </InputBox>
      <InputExtra
        errorText={errorText}
        extraStart={extraStart}
        extraEnd={showCharacterCount && undefined !== maxLength ? `${value?.length ?? 0} / ${maxLength}` : undefined}
        testID={testID}
      />
    </Pressable>
  );
}
