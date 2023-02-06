import DateTimePicker from "@react-native-community/datetimepicker";
import { StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface DatePickerIOSProps {
  buttonText: string;
  onConfirm: () => void;
  onClose: () => void;
  onChange: (value: Date) => void;
  headerText: string;
  helperText?: string;
  isVisible: boolean;
  value: Date;
}

export default function DatePickerIOS({
  buttonText,
  onConfirm,
  onClose,
  onChange,
  headerText,
  helperText,
  isVisible,
  value,
}: DatePickerIOSProps) {
  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    borderWidth: 1,
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["16p"],
  }));

  const helperTextContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["16p"],
  }));

  const accentColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <Modal onClose={onClose} headerText={headerText} visible={isVisible}>
      <View style={containerStyles}>
        <DateTimePicker
          accentColor={accentColor}
          display="inline"
          onChange={(_event, date) => onChange(date as Date)}
          value={value}
        />
      </View>
      <View style={helperTextContainerStyle}>
        {undefined !== helperText && (
          <Typography.Text color="neutralBase" size="footnote" weight="regular" style={styles.helperText}>
            {helperText}
          </Typography.Text>
        )}
      </View>
      <Button onPress={onConfirm}>{buttonText}</Button>
    </Modal>
  );
}

const styles = StyleSheet.create({
  helperText: {
    textAlign: "center",
  },
});
