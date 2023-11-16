import times from "lodash/times";
import { useState } from "react";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

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
  testID?: string;
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
  testID,
  value,
}: DayPickerProps) {
  const [isSelectButtonDisabled, setIsSelectButtonDisabled] = useState<boolean>(true);

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    borderWidth: 1,
  }));

  const digitSelectedStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.primaryBase,
    borderRadius: theme.spacing["8p"],
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

  const modalContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["32p"],
  }));

  return (
    <Modal onClose={onClose} headerText={headerText} visible={isVisible} style={modalContainerStyle} testID={testID}>
      <View style={containerStyles}>
        <View style={[daysContainerStyle, paddingStyle]}>
          {times(NUMBER_OF_ROWS).map(rowIndex => (
            <View key={rowIndex} style={styles.row}>
              {times(NUMBER_OF_COLUMNS).map(columnIndex => {
                // Adjust dayOfMonth calculation for the first row
                const dayOfMonth =
                  rowIndex === 0 ? columnIndex : columnIndex + 1 + (rowIndex - 1) * NUMBER_OF_COLUMNS + 6;

                const isSelected = dayOfMonth === value;

                // Return empty cell for the very first slot
                if (rowIndex === 0 && columnIndex === 0) {
                  return <Pressable key="empty-start" disabled style={styles.digit} />;
                }

                if (dayOfMonth < 1 || dayOfMonth > DAYS_PER_MONTH) {
                  return <Pressable key={dayOfMonth} disabled style={styles.digit} />;
                }

                return (
                  <Pressable
                    key={dayOfMonth}
                    onPress={() => {
                      setIsSelectButtonDisabled(false);
                      onChange(dayOfMonth);
                    }}
                    style={[styles.digit, isSelected && digitSelectedStyle]}
                    testID={testID !== undefined ? `${testID}-DayButton-${dayOfMonth}` : undefined}>
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
          <Typography.Text color="neutralBase" size="footnote" weight="regular" align="center">
            {helperText}
          </Typography.Text>
        )}
      </View>
      <Button
        onPress={onConfirm}
        testID={testID !== undefined ? `${testID}-ConfirmButton` : undefined}
        disabled={isSelectButtonDisabled}>
        {buttonText}
      </Button>
    </Modal>
  );
}

const DIGIT_SIZE = 40;
const DAYS_PER_MONTH = 28;
const NUMBER_OF_COLUMNS = 7;
const NUMBER_OF_ROWS = Math.ceil(DAYS_PER_MONTH / 7) + 1;

const styles = StyleSheet.create({
  digit: {
    alignItems: "center",
    height: DIGIT_SIZE,
    justifyContent: "center",
    width: DIGIT_SIZE,
  },
  row: {
    alignItems: "center",
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
});
