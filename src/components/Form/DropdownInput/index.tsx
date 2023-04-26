import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { FieldValues, useController } from "react-hook-form";
import { I18nManager, StyleSheet, View, ViewStyle } from "react-native";

import { AngleDownIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useThemeStyles } from "@/theme";

import InputBox from "../internal/InputBox";
import InputText from "../internal/InputText";
import { DropdownInputList } from "./DropdownInputList";
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
  const [selectedValue, setSelectedValue] = useState<(typeof field)["value"]>();

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

  const buttonContainer = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
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
          <DropdownInputList options={options} onChange={handleOnChange} value={selectedValue} />
        )}
        <View style={buttonContainer}>
          <Button onPress={handleOnConfirm} disabled={selectedValue === undefined}>
            {buttonLabel}
          </Button>
        </View>
      </Modal>
      <InputBox
        extraStart={extra}
        isEditable={isEditable}
        label={label}
        isTouched={fieldState.isTouched}
        error={fieldState.error}
        onPress={handleOnOpen}
        bordered={false}>
        <InputText
          buttonIcon={
            <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
              <AngleDownIcon />
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
});
