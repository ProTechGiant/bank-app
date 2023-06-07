import { useState } from "react";

import DayPicker from "@/components/DayPicker";

import { TableListCard } from "../TableList";

export interface DayPickerInputProps {
  buttonText: string;
  onBlur?: () => void;
  onChange?: (value: number) => void;
  headerText: string;
  helperText?: string | false | ((value: number) => string | undefined);
  label: string;
  placeholder: string;
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
      <TableListCard
        onPress={handleOnOpen}
        label={label}
        helperText={resolvedHelperText}
        end={<TableListCard.Day placeholder={placeholder} value={value} />}
      />
      <DayPicker
        buttonText={buttonText}
        headerText={headerText}
        onChange={handleOnChange}
        isVisible={isVisible}
        onClose={handleOnCancel}
        onConfirm={handleOnConfirm}
        helperText={resolvedHelperText}
        value={selectedValue}
      />
    </>
  );
}
