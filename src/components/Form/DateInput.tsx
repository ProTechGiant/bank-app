import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Platform, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { CalendarAltIcon } from "@/assets/icons";
import DatePickerIOS from "@/components/DatePickerIOS";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface DateInputProps<T extends FieldValues> {
  buttonText: string;
  control: Control<T>;
  format?: string;
  headerText: string;
  helperText?: string | false;
  label?: string | null | false;
  minimumDate?: Date;
  name: Path<T>;
  placeholder: string;
}

export default function DateInput<T extends FieldValues>({
  buttonText,
  control,
  label,
  name,
  headerText,
  helperText,
  placeholder,
  minimumDate,
  format: format_ = "dd MMM, yyyy",
}: DateInputProps<T>) {
  const { field } = useController({ control, name });

  const [isVisible, setIsVisible] = useState(false);
  const [confirmedValue, setConfirmedValue] = useState<Date | undefined>(field.value);
  const selectedValue = field.value ?? new Date();

  const handleOnConfirmIOS = () => {
    setIsVisible(false);
    setConfirmedValue(selectedValue);

    field.onChange(selectedValue);
    field.onBlur();
  };

  const handleOnChangeIOS = (value: Date) => {
    field.onChange(value);
  };

  const handleOnCancelIOS = () => {
    setIsVisible(false);

    field.onChange(confirmedValue);
    field.onBlur();
  };

  const handleOnOpen = () => {
    if (Platform.OS === "ios") setIsVisible(true);
    else if (Platform.OS === "android") handleOnShowDatePickerAndroid();
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

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    textAlign: "center",
    paddingHorizontal: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.small,
  }));

  const inputStype = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing["16p"],
  }));

  const helperTextContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: theme.palette["neutralBase-30"],
    paddingTop: 12,
    paddingBottom: theme.spacing["16p"],
  }));

  const valueTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: theme.spacing["8p"],
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["complimentBase"]);

  return (
    <>
      <View style={containerStyle}>
        <Pressable onPress={handleOnOpen} style={inputStype}>
          <Typography.Text color="neutralBase+30">{label}</Typography.Text>
          <View style={styles.pickerButton}>
            <CalendarAltIcon color={iconColor} />
            <Typography.Text color="complimentBase" style={valueTextStyle}>
              {undefined !== field.value ? format(field.value, format_) : placeholder}
            </Typography.Text>
          </View>
        </Pressable>
        {Platform.OS !== "ios" && !!helperText && (
          <View style={helperTextContainerStyle}>
            <Typography.Text color="neutralBase" size="footnote">
              {helperText}
            </Typography.Text>
          </View>
        )}
      </View>
      {Platform.OS === "ios" && (
        <DatePickerIOS
          buttonText={buttonText}
          headerText={headerText}
          onChange={handleOnChangeIOS}
          isVisible={isVisible}
          minimumDate={minimumDate}
          onClose={handleOnCancelIOS}
          onConfirm={handleOnConfirmIOS}
          helperText={helperText}
          value={selectedValue}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  pickerButton: {
    alignItems: "center",
    flexDirection: "row",
  },
});
