import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Keyboard, Platform } from "react-native";

import DatePickerIOS from "@/components/DatePickerIOS";
import { TableListCard } from "@/components/TableList";

interface DatePickerInputProps<T extends FieldValues> {
  buttonText: string;
  control: Control<T>;
  format?: string;
  headerText: string;
  helperText?: string | false | ((value: Date) => string | undefined);
  label: string;
  minimumDate?: Date;
  name: Path<T>;
  placeholder: string;
}

export default function DatePickerInput<T extends FieldValues>({
  buttonText,
  control,
  label,
  name,
  headerText,
  helperText,
  placeholder,
  minimumDate,
  format: format_ = "d MMM, yyyy",
}: DatePickerInputProps<T>) {
  const { field, fieldState } = useController({ control, name });

  const [isVisible, setIsVisible] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Date | undefined>(field.value);

  const handleOnConfirmIOS = () => {
    setIsVisible(false);

    field.onChange(selectedValue);
    field.onBlur();
  };

  const handleOnChangeIOS = (value: Date) => {
    setSelectedValue(value);
    setIsTouched(true);
  };

  const handleOnCancelIOS = () => {
    setIsVisible(false);
    setIsTouched(false);
    setSelectedValue(field.value);

    field.onBlur();
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
      value: field.value ?? new Date(),
      onChange: (event, date) => {
        if (event.type === "set") {
          field.onChange(date);
          setIsTouched(true);
          setSelectedValue(date);
        }

        field.onBlur();
      },
    });
  };

  const resolvedHelperText =
    isTouched && typeof helperText === "function" && undefined !== selectedValue
      ? helperText(selectedValue)
      : typeof helperText === "string"
      ? helperText
      : undefined;

  const isError = fieldState?.error !== undefined && fieldState.isTouched;
  const finalHelperText = isError ? fieldState.error?.message : resolvedHelperText;

  return (
    <>
      <TableListCard
        label={label}
        onPress={handleOnOpen}
        helperText={finalHelperText}
        isError={isError}
        end={<TableListCard.Date format={format_} placeholder={placeholder} value={field.value} />}
      />
      {Platform.OS === "ios" && (
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
      )}
    </>
  );
}
