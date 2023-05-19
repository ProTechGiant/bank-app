import { Picker } from "@react-native-picker/picker";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useThemeStyles } from "@/theme";

import { DropdownInputList } from "./DropdownInputList";

export interface DropdownInputProps<T extends string | number> {
  autoselect?: boolean;
  buttonLabel: string;
  onChange: (value: T | undefined) => void;
  onClose: () => void;
  options: Array<{ label: string; value: T; disabled?: boolean }>;
  headerText: string;
  isFixedHeight?: boolean;
  isVisible: boolean;
  value: T | undefined;
}

export default function DropdownInput<T extends string | number>({
  autoselect = true,
  buttonLabel,
  isFixedHeight = false,
  headerText,
  options = [],
  onChange,
  onClose,
  isVisible,
  value,
}: DropdownInputProps<T>) {
  const [selectedValue, setSelectedValue] = useState<T | undefined>();

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    if (autoselect && value === undefined && options.length > 0) {
      setSelectedValue(options[0].value);
    }
  }, [autoselect, options, isVisible, value]);

  const handleOnClose = () => {
    onClose();
    setSelectedValue(value);
  };

  const handleOnChange = useCallback(
    (nextValue: T) => {
      setSelectedValue(nextValue ?? options[0]?.value);
    },
    [options]
  );

  const handleOnConfirm = () => {
    onClose();
    onChange(selectedValue);
  };

  const buttonContainer = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  return (
    <Modal onClose={handleOnClose} headerText={headerText} visible={isVisible} hasHeaderDivider>
      {isFixedHeight ? (
        <DropdownInputList options={options} onChange={handleOnChange} value={selectedValue} />
      ) : (
        <Picker onValueChange={handleOnChange} itemStyle={styles.item} selectedValue={selectedValue}>
          {options.map(option => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              style={option.disabled && styles.itemDisabled}
            />
          ))}
        </Picker>
      )}
      <View style={buttonContainer}>
        <Button onPress={handleOnConfirm} disabled={selectedValue === undefined}>
          {buttonLabel}
        </Button>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  item: {
    color: "#000",
  },
  itemDisabled: {
    opacity: 0.4,
  },
});
