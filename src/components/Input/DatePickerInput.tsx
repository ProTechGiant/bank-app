import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Keyboard, Platform } from "react-native";

import DatePickerIOS from "@/components/DatePickerIOS";
import List from "@/components/List";

export interface DatePickerInputProps {
  buttonText: string;
  errorText?: string;
  onBlur?: () => void;
  onChange?: (value: Date | undefined) => void;
  format?: string;
  headerText: string;
  helperText?: string | false | ((value: Date) => string | undefined);
  label: string;
  minimumDate?: Date;
  placeholder: string;
  value?: Date;
}

export function DatePickerInput({
  buttonText,
  errorText,
  onBlur,
  onChange,
  label,
  headerText,
  helperText,
  placeholder,
  minimumDate,
  format: format_ = "d MMM yyyy",
  value,
}: DatePickerInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Date | undefined>(value);

  const handleOnConfirmIOS = () => {
    setIsVisible(false);

    onChange?.(selectedValue);
    onBlur?.();
  };

  const handleOnChangeIOS = (nextValue: Date) => {
    setSelectedValue(nextValue);
    setIsTouched(true);
  };

  const handleOnCancelIOS = () => {
    setIsVisible(false);
    setIsTouched(false);
    setSelectedValue(value);

    onBlur?.();
  };

  const handleOnOpen = () => {
    Keyboard.dismiss();

    if (Platform.OS === "ios") {
      setIsVisible(true);
    }

    if (Platform.OS === "android") {
      handleOnShowDatePickerAndroid();
    }
  };

  const handleOnShowDatePickerAndroid = () => {
    DateTimePickerAndroid.open({
      minimumDate,
      mode: "date",
      value: value ?? new Date(),
      onChange: (event, date) => {
        if (event.type === "set") {
          onChange?.(date);
          setIsTouched(true);
          setSelectedValue(date);
        }

        onBlur?.();
      },
    });
  };

  const resolvedHelperText =
    isTouched && typeof helperText === "function" && undefined !== selectedValue
      ? helperText(selectedValue)
      : typeof helperText === "string"
      ? helperText
      : undefined;
  const finalHelperText = undefined !== errorText ? errorText : resolvedHelperText;

  return (
    <List isBordered>
      <List.Item.DataTable
        label={label}
        onPress={handleOnOpen}
        helperText={finalHelperText}
        isError={errorText !== undefined}
        end={<List.End.Date format={format_} placeholder={placeholder} value={value} />}
      />
      {Platform.OS === "ios" ? (
        <DatePickerIOS
          buttonText={buttonText}
          headerText={headerText}
          onChange={handleOnChangeIOS}
          isVisible={isVisible}
          minimumDate={minimumDate}
          onClose={handleOnCancelIOS}
          onConfirm={handleOnConfirmIOS}
          helperText={resolvedHelperText}
          value={selectedValue ?? new Date()}
        />
      ) : null}
    </List>
  );
}
