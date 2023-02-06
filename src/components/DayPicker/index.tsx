import times from "lodash/times";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface DayPickerProps {
  buttonText: string;
  onConfirm: () => void;
  onClose: () => void;
  onChange: (value: number) => void;
  headerText?: string;
  helperText?: string;
  isVisible: boolean;
  value: number;
}

export default function DayPicker({
  buttonText,
  onConfirm,
  onClose,
  onChange,
  headerText,
  helperText,
  isVisible,
  value,
}: DayPickerProps) {
  const { t } = useTranslation();

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    borderWidth: 1,
  }));

  const digitSelectedStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.complimentBase,
    borderRadius: DIGIT_SIZE / 2,
  }));

  const paddingStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["16p"],
  }));

  const daysContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderTopColor: theme.palette["neutralBase-30"],
    borderTopWidth: 1,
  }));

  const helperTextContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["16p"],
  }));

  const daysInCurrentMonth = daysInThisMonth();
  const numberOfColumns = 7;
  const numberOfRows = Math.ceil(daysInCurrentMonth / 7);

  return (
    <Modal onClose={onClose} headerText={headerText} visible={isVisible}>
      <View style={containerStyles}>
        <Typography.Text color="neutralBase+30" size="callout" weight="medium" style={paddingStyle}>
          {t("DayPicker.currentlyOnDay", { count: value, ordinal: true })}
        </Typography.Text>
        <View style={[daysContainerStyle, paddingStyle]}>
          {times(numberOfRows).map(rowIndex => (
            <View key={rowIndex} style={styles.row}>
              {times(numberOfColumns).map(columnIndex => {
                const dayOfMonth = columnIndex + 1 + rowIndex * numberOfColumns;
                const isSelected = dayOfMonth === value;

                if (dayOfMonth < 1 || dayOfMonth > daysInCurrentMonth) {
                  return <Pressable key={dayOfMonth} disabled style={styles.digit} />;
                }

                return (
                  <Pressable
                    key={dayOfMonth}
                    onPress={() => onChange(dayOfMonth)}
                    style={[styles.digit, isSelected && digitSelectedStyle]}>
                    <Typography.Text
                      color={isSelected ? "neutralBase-50" : "neutralBase+30"}
                      size="title3"
                      weight={isSelected ? "semiBold" : "regular"}>
                      {dayOfMonth}
                    </Typography.Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
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

const DIGIT_SIZE = 40;

const styles = StyleSheet.create({
  digit: {
    alignItems: "center",
    height: DIGIT_SIZE,
    justifyContent: "center",
    width: DIGIT_SIZE,
  },
  helperText: {
    textAlign: "center",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
});

function daysInThisMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}
