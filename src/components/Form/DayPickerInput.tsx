import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Platform, ViewStyle } from "react-native";

import { CalendarAltIcon } from "@/assets/icons";
import DayPicker from "@/components/DayPicker";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import InputCard from "./internal/InputCard";

interface DayPickerInputProps<T extends FieldValues> {
  buttonText: string;
  control: Control<T>;
  headerText: string;
  helperText?: string | false | ((value: number) => string | undefined);
  label?: string | null | false;
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
  const { t } = useTranslation();

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

  const valueTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: theme.spacing["8p"],
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["complimentBase"]);

  const resolvedHelperText =
    typeof helperText === "function" && undefined !== selectedValue
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
              {undefined !== field.value
                ? t("DayPicker.currentlyOnDay", { count: field.value, ordinal: true })
                : placeholder}
            </Typography.Text>
          </>
        }
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
