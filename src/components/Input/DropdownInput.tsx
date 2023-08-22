import { Picker } from "@react-native-picker/picker";
import { useRef, useState } from "react";
import { I18nManager, Platform, Pressable, StyleSheet, TextStyle, View } from "react-native";

import { AngleDownIcon } from "@/assets/icons";
import DropdownIOS, { DropdownIOSProps } from "@/components/DropdownIOS";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import InputBox from "./internal/InputBox";
import InputExtra from "./internal/InputExtra";
import InputText from "./internal/InputText";

type BaseProps<T extends string | number> = Omit<DropdownIOSProps<T>, "onClose" | "isVisible">;
export interface DropdownInputProps<T extends string | number> extends Omit<BaseProps<T>, "headerText"> {
  errorText?: string;
  extra?: string;
  onBlur?: () => void;
  headerText?: string;
  isEditable?: boolean;
  label: string;
  placeholder?: string;
  variant?: "simple" | "small";
  testID?: string;
}

export function DropdownInput<T extends string | number>({
  errorText,
  extra,
  onBlur,
  onChange,
  options,
  headerText,
  isEditable = true,
  isFixedHeight,
  label,
  placeholder,
  value,
  variant,
  testID,
  ...restProps
}: DropdownInputProps<T>) {
  const pickerRef = useRef<Picker<T>>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleOnOpen = () => {
    if (!isEditable) return;

    setIsVisible(true);
  };

  const handleOnClose = () => {
    setIsVisible(false);
    onBlur?.();
  };

  const handleOnChange = (nextValue: T) => {
    if (!isVisible) return;

    onChange?.(nextValue);
    onBlur?.();

    setIsVisible(false);
  };

  const pickerAndroidPromptStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.body,
  }));

  const pickerAndroidItemStyle = useThemeStyles<TextStyle>(theme => ({
    fontSize: theme.typography.text.sizes.callout,
  }));

  return (
    <>
      {Platform.OS === "ios" || isFixedHeight ? (
        <>
          <Stack
            as={Pressable}
            onPress={() => handleOnOpen()}
            gap="8p"
            direction="vertical"
            testID={testID !== undefined ? `${testID}:InputBox` : undefined}>
            {variant === "small" ? (
              <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                {label}
              </Typography.Text>
            ) : null}
            <InputBox isError={errorText !== undefined} isFocused={isVisible}>
              <InputText
                buttonIcon={
                  <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
                    <AngleDownIcon />
                  </View>
                }
                placeholder={placeholder}
                value={options.find(opt => opt.value === value)?.label}
              />
            </InputBox>
            <InputExtra errorText={errorText} extraStart={extra} />
          </Stack>
          <DropdownIOS
            {...restProps}
            headerText={headerText ?? label}
            onChange={handleOnChange}
            onClose={handleOnClose}
            options={options}
            isFixedHeight={isFixedHeight}
            isVisible={isVisible}
            value={value}
            testID={testID !== undefined ? `${testID}:DropdownInput` : undefined}
          />
        </>
      ) : (
        <>
          <View>
            <Picker
              ref={pickerRef}
              onValueChange={handleOnChange}
              style={styles.pickerAndroid}
              selectedValue={value}
              testID={testID !== undefined ? `${testID}:DropdownInput` : undefined}>
              <Picker.Item enabled={false} label={placeholder} style={pickerAndroidPromptStyle} />
              {options.map(option => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  enabled={!option.disabled}
                  style={pickerAndroidItemStyle}
                />
              ))}
            </Picker>
            <Stack
              as={Pressable}
              gap="8p"
              direction="vertical"
              onPress={() => {
                setIsVisible(true);
                pickerRef.current?.focus();
              }}
              testID={testID !== undefined ? `${testID}:InputBox` : undefined}>
              {variant === "small" ? (
                <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                  {label}
                </Typography.Text>
              ) : null}
              <InputBox isError={errorText !== undefined} isFocused={isVisible}>
                <InputText
                  buttonIcon={
                    <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
                      <AngleDownIcon />
                    </View>
                  }
                  placeholder={label}
                  value={options.find(opt => opt.value === value)?.label}
                />
              </InputBox>
              <InputExtra errorText={errorText} extraStart={extra} />
            </Stack>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  pickerAndroid: {
    opacity: 0,
    position: "absolute",
  },
});
