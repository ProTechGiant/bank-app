import { useRef, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import {
  I18nManager,
  Platform,
  Pressable,
  Text,
  TextInput as RNTextInput,
  TextInput,
  TextInputProps as RNTextInputProps,
  TextStyle,
} from "react-native";

import { useThemeStyles } from "@/theme";
import { removeSpaces } from "@/utils";

import InputBox from "./internal/InputBox";

interface TextInputProps<T extends FieldValues>
  extends Omit<
    RNTextInputProps,
    "onBlur" | "onChangeText" | "onFocus" | "placeholderTextColor" | "placeholder" | "style" | "value"
  > {
  control: Control<T>;
  extra?: React.ComponentProps<typeof InputBox>["extraStart"];
  isEditable?: boolean;
  name: Path<T>;
  placeholder?: string | undefined;
  label?: string | null;
  showCharacterCount?: boolean;
  icon?: React.ReactElement;
  mask: string;
}

export default function MaskedTextInput<T extends FieldValues>({
  control,
  extra,
  isEditable,
  label,
  maxLength,
  name,
  showCharacterCount,
  placeholder,
  icon,
  mask,
  ...restProps
}: TextInputProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const textInputRef = useRef<TextInput>(null);

  const isError = undefined !== fieldState?.error && fieldState.isTouched;
  const [isFocused, setIsFocused] = useState(false);
  const [masked, setMasked] = useState("");
  const [hints, setHints] = useState(mask);

  const numberOfSpace = mask.split(" ").length - 1;

  const handleValueChange = (inputValue: string) => {
    let maskedValue = "";
    let i = 0;
    const rawInputValue = removeSpaces(inputValue);

    // iterate over the mask pattern and replace masked text to input character
    for (const char of mask) {
      if (char !== " ") {
        if (i < rawInputValue.length) {
          maskedValue += rawInputValue[i];
          i++;
        } else {
          break;
        }
      } else {
        maskedValue += char;
      }
    }
    // remove last space otherwise not able to delete last space
    setMasked(maskedValue.trim());
    // append remaining hints to masked input value
    setHints(maskedValue.concat(mask?.slice(maskedValue.length)) || "");
  };

  const handleOnFocus = () => {
    textInputRef.current?.focus();
  };

  const textStyle = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette["neutralBase+20"],
      fontSize: theme.typography.text.sizes.callout,
      fontWeight: theme.typography.text.weights.regular,
      padding: 0,
      backgroundColor: isError ? theme.palette["errorBase-40"] : theme.palette["neutralBase-50"],
      flexGrow: 0,
    }),
    [isError]
  );

  const placeholderTextColor = useThemeStyles(theme => theme.palette.neutralBase, []);

  const maskedTextStyle = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette["neutralBase-10"],
  }));

  const maskedTextContainerStyle = useThemeStyles<TextStyle>(theme => ({
    left: theme.spacing["16p"],
    position: "absolute",
    top: Platform.OS === "ios" ? 15 : 13,
    textAlign: I18nManager.isRTL ? "right" : "left",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  }));

  return (
    <InputBox
      extraStart={extra}
      extraEnd={
        showCharacterCount && undefined !== maxLength ? `${field.value?.length ?? 0} / ${maxLength}` : undefined
      }
      isEditable={isEditable}
      isFocused={isFocused}
      fieldState={fieldState}
      label={label}
      icon={icon}>
      {fieldState.isTouched ? (
        <Pressable style={maskedTextContainerStyle} onPress={handleOnFocus}>
          <Text style={[textStyle, maskedTextStyle]}>{hints}</Text>
        </Pressable>
      ) : null}
      <RNTextInput
        editable={isEditable}
        ref={textInputRef}
        onBlur={() => {
          field.onBlur();
          setIsFocused(false);
        }}
        onChangeText={value => {
          handleValueChange(value);
          field.onChange(removeSpaces(value));
        }}
        onFocus={() => setIsFocused(true)}
        maxLength={maxLength !== undefined ? maxLength + numberOfSpace : undefined}
        placeholder={!fieldState.isTouched ? placeholder : undefined ?? undefined} // Remove placeholder when started typing otherwise hints will be hidden by the text input in Android
        placeholderTextColor={placeholderTextColor}
        style={[
          textStyle,
          { width: fieldState.isTouched && masked.length === 0 ? 0 : masked.length === 1 ? 10 : "auto" }, // To fix part of the second hints character hidden by the input field in Android
          fieldState.error !== undefined && fieldState.isTouched && { maxWidth: "92%" },
        ]}
        value={masked}
        textAlign={I18nManager.isRTL ? "right" : "left"}
        {...restProps}
      />
    </InputBox>
  );
}
