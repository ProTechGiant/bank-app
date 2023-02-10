import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Platform, ViewStyle } from "react-native";

import { CalendarAltIcon } from "@/assets/icons";
import DatePickerIOS from "@/components/DatePickerIOS";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import InputCard from "./internal/InputCard";

interface DatePickerInputProps<T extends FieldValues> {
  buttonText: string;
  control: Control<T>;
  format?: string;
  headerText: string;
  helperText?: string | false | ((value: Date) => string | undefined);
  label?: string | null | false;
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
  format: format_ = "PP",
}: DatePickerInputProps<T>) {
  const { field } = useController({ control, name });

  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(field.value ?? new Date());

  const handleOnConfirmIOS = () => {
    setIsVisible(false);

    field.onChange(selectedValue);
    field.onBlur();
  };

  const handleOnChangeIOS = (value: Date) => {
    setSelectedValue(value);
  };

  const handleOnCancelIOS = () => {
    setIsVisible(false);
    setSelectedValue(field.value ?? new Date());

    field.onBlur();
  };

  const handleOnOpen = () => {
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
        }

        if (event.type === "dismissed") {
          field.onBlur();
        }
      },
    });
  };

  const valueTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: theme.spacing["8p"],
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["complimentBase"]);

  const resolvedHelperText =
    field.value === undefined && Platform.OS !== "ios"
      ? undefined // not to show helper message for android on load
      : typeof helperText === "function" && undefined !== selectedValue
      ? helperText(selectedValue)
      : typeof helperText === "string"
      ? helperText
      : undefined;

  return (
    <>
      <InputCard
        label={label}
        helperText={Platform.OS !== "ios" ? resolvedHelperText : undefined}
        onPress={handleOnOpen}
        value={
          <>
            <CalendarAltIcon color={iconColor} />
            <Typography.Text color="complimentBase" style={valueTextStyle}>
              {undefined !== field.value ? format(field.value, format_) : placeholder}
            </Typography.Text>
          </>
        }
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
          value={selectedValue}
        />
      )}
    </>
  );
}
