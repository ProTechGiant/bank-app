import React from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";
import { Calendar } from "react-native-calendars";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useThemeStyles } from "@/theme";

interface DatePickerModalProps {
  onDateSelected: (date: Date) => void;
  onClose: () => void;
  isVisible: boolean;
}

export default function DatePickerModal({ onDateSelected, onClose, isVisible }: DatePickerModalProps) {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = React.useState("");
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];

  React.useEffect(() => {
    if (isVisible) {
      setSelectedDate("");
    }
  }, [isVisible]);

  const calenderStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  return (
    <Modal onClose={onClose} headerText={t("GoalGetter.targetAmountScreen.title")} visible={isVisible}>
      <Calendar
        style={calenderStyle}
        current={todayFormatted}
        minDate={todayFormatted}
        onDayPress={day => setSelectedDate(day.dateString)}
        monthFormat="yyyy MMM"
        hideExtraDays={true}
        disableMonthChange={true}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#023" },
        }}
      />
      <Button onPress={() => onDateSelected(new Date(selectedDate))} disabled={!selectedDate}>
        {t("GoalGetter.targetAmountScreen.confirm")}
      </Button>
    </Modal>
  );
}
