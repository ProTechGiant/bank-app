import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { FieldValues, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, View } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

import InputBox from "../internal/InputBox";
import InputText from "../internal/InputText";
import DropdownInputProps from "./DropdownInputProps";

export default function DropdownInput<T extends FieldValues>({
  control,
  extra,
  isEditable = true,
  headerText,
  label,
  name,
  placeholder,
  options = [],
}: DropdownInputProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<typeof field["value"]>();
  const { i18n } = useTranslation();

  useEffect(() => {
    setSelectedValue(field.value);
  }, [field.value]);

  useEffect(() => {
    if (!isEditable || undefined !== placeholder || options.length < 1 || undefined !== field.value) return;

    const defaultValue = options[0].value;
    setSelectedValue(defaultValue);
    setImmediate(() => field.onChange(defaultValue));
  }, [isEditable, placeholder, options]);

  const handleOnOpen = () => {
    if (!isEditable) return;

    if (field.value === undefined && options.length > 0) setSelectedValue(options[0].value);
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

  return (
    <>
      <Modal onClose={handleOnClose} headerText={headerText ?? label} visible={isVisible}>
        <Picker onValueChange={handleOnChange} itemStyle={styles.item} selectedValue={selectedValue}>
          {options.map(option => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
        <Button onPress={handleOnConfirm}>Confirm</Button>
      </Modal>
      <InputBox extraStart={extra} isEditable={isEditable} label={label} fieldState={fieldState} onPress={handleOnOpen}>
        <InputText
          buttonIcon={
            <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
              <ChevronRightIcon />
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
  item: {
    color: "#000",
  },
});
