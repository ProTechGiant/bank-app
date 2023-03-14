import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

import DayPicker from "@/components/DayPicker";

import { TableListCard } from "../TableList";

interface DayPickerInputProps<T extends FieldValues> {
  buttonText: string;
  control: Control<T>;
  headerText: string;
  helperText?: string | false | ((value: number) => string | undefined);
  label: string;
  name: Path<T>;
  placeholder: string;
}

export default function DayPickerInput<T extends FieldValues>({
  buttonText,
  control,
  label,
  name,
  headerText,
  helperText,
  placeholder,
}: DayPickerInputProps<T>) {
  const { field } = useController({ control, name });

  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(field.value ?? 1);

  const handleOnConfirm = () => {
    setIsVisible(false);

    field.onChange(selectedValue);
    field.onBlur();
  };

  const handleOnChange = (value: number) => {
    setSelectedValue(value);
  };

  const handleOnCancel = () => {
    setIsVisible(false);
    setSelectedValue(field.value ?? 1);

    field.onBlur();
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
        end={<TableListCard.Day placeholder={placeholder} value={field.value} />}
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
