import { eachDayOfInterval, endOfMonth, format } from "date-fns";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";
import { Calendar } from "react-native-calendars";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";

interface CalenderDayModalProps {
  onDateSelected: (date: Date) => void;
  onClose: () => void;
  isVisible: boolean;
  currentDate: string;
}

export default function CalenderDayModal({ onDateSelected, onClose, isVisible, currentDate }: CalenderDayModalProps) {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const handleOnPressSetDate = () => {
    onDateSelected(new Date(selectedDate));
    onClose();
  };

  const getDisabledDates = (date: Date) => {
    const endOfTheMonth = endOfMonth(date);
    return eachDayOfInterval({
      start: new Date(endOfTheMonth.getFullYear(), endOfTheMonth.getMonth(), 29),
      end: endOfTheMonth,
    }).map(date => format(date, "yyyy-MM-dd"));
  };
  const disabledDates = getDisabledDates(new Date(selectedDate));

  const disabledMarkedDates = disabledDates.reduce((acc, date) => {
    acc[date] = { disabled: true, disableTouchEvent: true };
    return acc;
  }, {});

  disabledMarkedDates[selectedDate] = {
    customStyles: {
      container: {
        borderRadius: 8,
      },
    },
    selected: true,
    selectedColor: "#EC5F48",
  };

  const calenderStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderBottomLeftRadius: theme.radii.small,
    borderBottomRightRadius: theme.radii.small,
  }));

  const calendarBackgroundColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);

  const calendarTextColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <Modal
      testID="goalGetter.component.calenderDayModal"
      onClose={onClose}
      headerText={t("GoalGetter.ShapeYourGoalContributions.DatePickerModal")}
      visible={isVisible}>
      <Calendar
        key={selectedDate}
        markedDates={disabledMarkedDates}
        current={selectedDate}
        scrollEnabled={true}
        showScrollIndicator={true}
        customHeaderTitle={<></>}
        theme={{
          calendarBackground: calendarBackgroundColor,
          textSectionTitleColor: calendarTextColor,
          todayTextColor: calendarTextColor,
          dayTextColor: calendarTextColor,
          monthTextColor: calendarTextColor,
        }}
        style={calenderStyle}
        onDayPress={day => {
          setSelectedDate(day.dateString);
        }}
        enableSwipeMonths={false}
        hideArrows={true}
        hideExtraDays={true}
        markingType="custom"
      />
      <Button onPress={handleOnPressSetDate}>{t("GoalGetter.ShapeYourGoalContributions.selectDate")}</Button>
      <Stack direction="vertical" gap="8p" align="stretch">
        <Button variant="tertiary" onPress={onClose}>
          {t("GoalGetter.ShapeGoalScreen.DatePickerModal.cancelButton")}
        </Button>
      </Stack>
    </Modal>
  );
}
