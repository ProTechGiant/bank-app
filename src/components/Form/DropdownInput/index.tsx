import { Picker } from "@react-native-picker/picker";
import { FieldProps } from "formik";
import * as React from "react";
import { StyleSheet } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

import InputBox from "../internal/InputBox";

interface DropdownProps extends FieldProps<string | null> {
  isEditable?: boolean;
  placeholder?: string;
  isRequired?: boolean;
  label?: string;
  options: Array<{ label: string; value: string | null }>;
}

export default function DropdownInput({
  isEditable = true,
  field,
  label,
  placeholder,
  isRequired,
  options = [],
}: DropdownProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<DropdownProps["field"]["value"]>();

  React.useEffect(() => {
    setSelectedValue(field.value);
  }, [field.value]);

  React.useEffect(() => {
    if (!isEditable || undefined !== placeholder || options.length < 1 || undefined !== field.value) return;

    const defaultValue = options[0].value;
    setSelectedValue(defaultValue);
    setImmediate(() => field.onChange({ target: { name: field.name, value: defaultValue } }));
  }, [isEditable, placeholder, options]);

  const handleOnOpen = () => {
    if (!isEditable) return;
    if (field.value === undefined && options.length > 0) setSelectedValue(options[0].value);
    setIsVisible(true);
  };

  const handleOnClose = () => {
    setIsVisible(false);
    setSelectedValue(field.value);
  };

  const handleOnConfirm = () => {
    setIsVisible(false);

    field.onChange({ target: { name: field.name, value: selectedValue } });
  };

  const handleOnChange = (value: string) => {
    setSelectedValue(value ?? options[0]?.value);
  };

  return (
    <>
      <Modal onClose={handleOnClose} headerText="Select a city" visible={isVisible}>
        <Picker onValueChange={handleOnChange} itemStyle={styles.item} selectedValue={selectedValue}>
          {options.map(option => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
        <Button onPress={handleOnConfirm}>Confirm</Button>
      </Modal>
      <InputBox
        buttonIcon={<ChevronRightIcon />}
        label={label}
        onPress={handleOnOpen}
        placeholder={placeholder}
        isRequired={isRequired}
        value={options.find(opt => opt.value === field.value)?.label}
      />
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    color: "#000",
  },
});
