import { useState } from "react";

import DayPicker from "@/components/DayPicker";
import List from "@/components/List";

export interface DayPickerInputProps {
  buttonText: string;
  onBlur?: () => void;
  onChange?: (value: number) => void;
  headerText: string;
  helperText?: string | false | ((value: number) => string | undefined);
  label: string;
  placeholder: string;
  testID?: string;
  value?: number;
}

export function DayPickerInput({
  buttonText,
  onBlur,
  onChange,
  label,
  headerText,
  helperText,
  placeholder,
  testID,
  value,
}: DayPickerInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value ?? 1);

  const handleOnConfirm = () => {
    setIsVisible(false);

    onChange?.(selectedValue);
    onBlur?.();
  };

  const handleOnChange = (nextSelectedValue: number) => {
    setSelectedValue(nextSelectedValue);
  };

  const handleOnCancel = () => {
    setIsVisible(false);
    setSelectedValue(value ?? 1);

    onBlur?.();
  };

  const handleOnOpen = () => {
    setIsVisible(true);
  };

  const resolvedHelperText =
    typeof helperText === "function" && undefined !== selectedValue
      ? helperText(selectedValue)
      : typeof helperText === "string"
      ? helperText
      : undefined;

  return (
    <>
      <List isBordered>
        <List.Item.DataTable
          onPress={handleOnOpen}
          label={label}
          helperText={resolvedHelperText}
          end={<List.End.Day placeholder={placeholder} value={value} />}
          testID={testID !== undefined ? `${testID}-OpenButton` : undefined}
        />
      </List>
      <DayPicker
        buttonText={buttonText}
        headerText={headerText}
        onChange={handleOnChange}
        isVisible={isVisible}
        onClose={handleOnCancel}
        onConfirm={handleOnConfirm}
        helperText={resolvedHelperText}
        testID={testID !== undefined ? `${testID}-DayPicker` : undefined}
        value={selectedValue}
      />
    </>
  );
}
