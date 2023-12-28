import { useMemo, useRef, useState } from "react";
import {
  I18nManager,
  Platform,
  Pressable,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import { MaskArray, useMaskedInputProps } from "react-native-mask-input";

import { useThemeStyles } from "@/theme";

import FloatingLabel from "./internal/FloatingLabel";
import InputBox from "./internal/InputBox";
import InputExtra from "./internal/InputExtra";

export interface MaskedTextInputProps extends Omit<RNTextInputProps, "autoCorrect" | "autoComplete"> {
  errorText?: string;
  isEditable?: boolean;
  onBlur?: () => void;
  onChangeText?: (value: string) => void;
  onFocus?: () => void;
  label: string;
  mask: MaskArray;
  value?: string;
  onClear?: () => void;
  onCrossClear?: () => void | undefined;
  showQrIcon?: boolean;
  onQrScanPress?: () => void | undefined;
  hideEndText?: boolean;
}

export function MaskedTextInput({
  errorText,
  isEditable = true,
  onBlur,
  onChangeText: propsOnChangeText,
  onFocus,
  label,
  mask,
  onClear,
  value: propsValue,
  onCrossClear = undefined,
  hideEndText = false,
  onQrScanPress,
  showQrIcon,
  ...restProps
}: MaskedTextInputProps) {
  const textInputRef = useRef<RNTextInput>(null);

  const [isFocused, setIsFocused] = useState(false);
  const numberOfSpacesInMask = useMemo(() => mask.filter(v => v === " ").length, [mask]);

  const { onChangeText, placeholder, value } = useMaskedInputProps({
    mask,
    value: propsValue,
    onChangeText: masked => {
      propsOnChangeText?.(masked.replaceAll(" ", ""));
    },
    maskAutoComplete: true,
  });

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
    theme => ({
      color: isEditable ? theme.palette["neutralBase+30"] : theme.palette["neutralBase-20"],
      fontSize: theme.typography.text.sizes.callout,
      fontWeight: theme.typography.text.weights.regular,
      flexGrow: 1,
      margin: 0,
      padding: 0,
      position: "absolute",
      left: theme.spacing["16p"],
      right: theme.spacing["16p"],
      top: 25 - (Platform.OS === "android" ? 3.5 : 0),
    }),
    [isEditable]
  );

  return (
    <Pressable onPress={() => handleOnFocus()}>
      <InputBox
        onClear={onClear}
        value={value}
        onCrossClear={value.length > 0 && onCrossClear ? onCrossClear : undefined}
        isError={undefined !== errorText}
        isFocused={isFocused}
        numberOfLines={1}
        showQrIcon={showQrIcon}
        onQrScanPress={onQrScanPress}>
        <FloatingLabel containsValue={value.length > 0} isEditable={isEditable} isFocused={isFocused} label={label} />
        <RNTextInput
          {...restProps}
          accessibilityLabel={label}
          autoCorrect={false}
          autoComplete="off"
          editable={isEditable}
          ref={textInputRef}
          onBlur={() => handleOnBlur()}
          onChangeText={onChangeText}
          onFocus={() => handleOnFocus()}
          placeholder={isFocused ? placeholder : undefined}
          maxLength={mask.length}
          numberOfLines={1}
          style={textInputStyle}
          textAlign={I18nManager.isRTL ? "right" : "left"}
          value={value}
        />
      </InputBox>
      <InputExtra
        errorText={errorText}
        extraEnd={
          hideEndText
            ? ""
            : `${Math.max((value?.length ?? 0) - numberOfSpacesInMask, 0)} / ${mask.length - numberOfSpacesInMask}`
        }
      />
    </Pressable>
  );
}
