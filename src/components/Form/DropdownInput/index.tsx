import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { FieldValues, useController } from "react-hook-form";
import { Dimensions, I18nManager, Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import { CheckmarkCircle, ChevronRightIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import InputBox from "../internal/InputBox";
import InputText from "../internal/InputText";
import DropdownInputProps from "./DropdownInputProps";

export default function DropdownInput<T extends FieldValues>({
  control,
  fullHeight = false,
  extra,
  isEditable = true,
  headerText,
  label,
  name,
  placeholder,
  options = [],
  buttonLabel,
  autoselect = true,
}: DropdownInputProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<typeof field["value"]>();

  useEffect(() => {
    setSelectedValue(field.value);
  }, [field.value]);

  useEffect(() => {
    if (!isEditable || undefined !== placeholder || options.length < 1 || undefined !== field.value) return;

    if (autoselect) {
      const defaultValue = options[0].value;
      setSelectedValue(defaultValue);
      setImmediate(() => field.onChange(defaultValue));
    }
  }, [isEditable, placeholder, options]);

  const handleOnOpen = () => {
    if (!isEditable) return;

    if (autoselect && field.value === undefined && options.length > 0) {
      setSelectedValue(options[0].value);
    }

    setIsVisible(true);
  };

  const handleOnClose = () => {
    setIsVisible(false);
    setSelectedValue(field.value);

    field.onBlur();
  };

  const handleOnChange = (value: typeof selectedValue) => {
    setSelectedValue(value ?? options[0]?.value);
  };

  const handleOnConfirm = () => {
    setIsVisible(false);

    field.onBlur();
    field.onChange(selectedValue);
  };

  const chevronOpenIconColor = useThemeStyles(theme => theme.palette.neutralBase);

  const modalContainer = useThemeStyles<ViewStyle>(() => ({
    height: Dimensions.get("window").height - 254,
  }));

  const optionContainer = useThemeStyles<ViewStyle>(({ spacing, palette }) => ({
    paddingVertical: spacing["16p"],
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: palette["neutralBase-20"],
  }));

  const checkBoxStyles = useThemeStyles<ViewStyle>(({ palette }) => ({
    borderColor: palette["neutralBase-20"],
    height: 24,
    width: 24,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  }));

  const buttonContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["16p"],
    width: "100%",
  }));

  return (
    <>
      <Modal onClose={handleOnClose} headerText={headerText ?? label} visible={isVisible}>
        {!fullHeight ? (
          <Picker onValueChange={handleOnChange} itemStyle={styles.item} selectedValue={selectedValue}>
            {options.map(option => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
                style={option.disabled ? styles.disabledOpacity : undefined}
              />
            ))}
          </Picker>
        ) : (
          <ScrollView style={modalContainer}>
            {options.map(option => (
              <Pressable
                key={option.value}
                onPress={() => !option.disabled && handleOnChange(option.value)}
                style={[optionContainer, option.disabled && styles.disabledOpacity]}>
                <View style={styles.textContainer}>
                  <Typography.Text color="primaryBase+30" size="callout" weight="regular">
                    {option.label}
                  </Typography.Text>
                </View>
                <View style={checkBoxStyles}>
                  {(selectedValue === option.value || option.disabled === true) && <CheckmarkCircle />}
                </View>
                <View />
              </Pressable>
            ))}
          </ScrollView>
        )}
        <View style={buttonContainer}>
          <Button onPress={handleOnConfirm} disabled={selectedValue === undefined}>
            {buttonLabel}
          </Button>
        </View>
      </Modal>
      <InputBox extraStart={extra} isEditable={isEditable} label={label} fieldState={fieldState} onPress={handleOnOpen}>
        <InputText
          buttonIcon={
            <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
              <ChevronRightIcon color={chevronOpenIconColor} />
            </View>
          }
          placeholder={placeholder}
          value={options.find(opt => opt.value === field.value)?.label}
        />
      </InputBox>
    </>
  );
}

const styles = StyleSheet.create({
  disabledOpacity: {
    opacity: 0.4,
  },
  item: {
    color: "#000",
  },
  textContainer: {
    flex: 1,
  },
});
