import { Picker } from "@react-native-picker/picker";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Platform, Pressable, StyleSheet, TextStyle, View } from "react-native";

import DropdownIOS, { DropdownIOSProps } from "@/components/DropdownIOS";
import InputBox from "@/components/Input/internal/InputBox";
import InputText from "@/components/Input/internal/InputText";
import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";

import { CalendarIcon } from "../assets/icons";

type BaseProps<T extends string | number> = Omit<DropdownIOSProps<T>, "onClose" | "isVisible">;
export interface BottomSheetModalProps<T extends string | number> extends Omit<BaseProps<T>, "headerText"> {
  errorText?: string;
  extra?: string;
  onBlur?: () => void;
  headerText?: string;
  label: string;
  buttonLabel: string;
}

export default function BottomSheetModal<T extends string | number>({
  errorText,
  onBlur,
  onChange,
  options,
  headerText,
  isFixedHeight,
  label,
  value,
  buttonLabel,
}: BottomSheetModalProps<T>) {
  const pickerRef = useRef<Picker<T>>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { t } = useTranslation();

  const handleOnOpen = () => {
    setIsVisible(true);
  };

  const handleOnClose = () => {
    setIsVisible(false);
    onBlur?.();
  };

  const handleOnChange = (nextValue: T) => {
    if (!isVisible) return;

    onChange?.(nextValue);

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
          <Stack as={Pressable} onPress={() => handleOnOpen()}>
            <InputBox isError={errorText !== undefined} isFocused={isVisible}>
              <InputText
                buttonIcon={
                  <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
                    <CalendarIcon />
                  </View>
                }
                value={
                  value
                    ? options.find(opt => opt.value === value)?.label
                    : t("GoalGetter.ShapeYourGoalContributions.selectDay")
                }
              />
            </InputBox>
          </Stack>
          <DropdownIOS
            buttonLabel={buttonLabel}
            headerText={headerText ?? label}
            onChange={handleOnChange}
            onClose={handleOnClose}
            options={options}
            isFixedHeight={isFixedHeight}
            isVisible={isVisible}
            value={value}
          />
        </>
      ) : (
        <>
          <View>
            <Picker ref={pickerRef} onValueChange={handleOnChange} style={styles.pickerAndroid} selectedValue={value}>
              <Picker.Item enabled={false} style={pickerAndroidPromptStyle} />
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
              }}>
              <InputBox isError={errorText !== undefined} isFocused={isVisible}>
                <InputText
                  buttonIcon={
                    <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
                      <CalendarIcon />
                    </View>
                  }
                  value={
                    value
                      ? options.find(opt => opt.value === value)?.label
                      : t("GoalGetter.ShapeYourGoalContributions.selectDay")
                  }
                />
              </InputBox>
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
