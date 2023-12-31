import { Picker } from "@react-native-picker/picker";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useThemeStyles } from "@/theme";

import { DropdownInputList } from "./DropdownInputList";

export interface DropdownIOSProps<T extends string | number> {
  autoselect?: boolean;
  buttonLabel: string;
  onChange?: (value: T) => void;
  onClose: () => void;
  options: Array<{ label: string; value: T; disabled?: boolean }>;
  headerText: string;
  isFixedHeight?: boolean;
  isVisible: boolean;
  value: T | undefined;
  testID?: string;
}

export default function DropdownIOS<T extends string | number>({
  autoselect = false,
  buttonLabel,
  isFixedHeight = false,
  headerText,
  options = [],
  onChange,
  onClose,
  isVisible,
  value,
  testID,
}: DropdownIOSProps<T>) {
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
    onChange?.(selectedValue as T);
  };

  const buttonContainer = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  return (
    <Modal
      onClose={handleOnClose}
      headerText={headerText}
      visible={isVisible}
      hasHeaderDivider
      testID={testID !== undefined ? `${testID}-Modal` : undefined}>
      {isFixedHeight ? (
        <DropdownInputList options={options} onChange={handleOnChange} value={selectedValue} testID={testID} />
      ) : (
        <Picker onValueChange={handleOnChange} itemStyle={styles.item} selectedValue={selectedValue} testID={testID}>
          {options.map(option => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              style={option.disabled && styles.itemDisabled}
              testID={testID !== undefined ? `${testID}-${option.value}` : undefined}
            />
          ))}
        </Picker>
      )}
      <View style={buttonContainer}>
        <Button
          onPress={handleOnConfirm}
          disabled={selectedValue === undefined}
          testID={testID !== undefined ? `${testID}-ConfirmButton` : undefined}>
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
