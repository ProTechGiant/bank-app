import { addMonths, format } from "date-fns";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, ViewStyle } from "react-native";
import { Calendar } from "react-native-calendars";

import { ChevronLeftIcon, ChevronRightIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Pill from "@/components/Pill";
import { useThemeStyles } from "@/theme";

import MonthPicker from "./MonthPicker";

interface DateRangePickerProps {
  onDateSelected: (date: Date) => void;
  onClose: () => void;
  onDurationSelect?: (durationItem: { text: string; value: number }) => void;
  isVisible: boolean;
  currentDate: string;
  withDuration?: boolean;
  minimumDuration?: number;
  maximumDuration?: number;
}

export default function DateRangePicker({
  onDateSelected,
  onClose,
  onDurationSelect,
  isVisible,
  currentDate,
  withDuration = true,
  minimumDuration,
  maximumDuration,
}: DateRangePickerProps) {
  const { t } = useTranslation();
  const todayDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);
  const maxDate = maximumDuration ? addMonths(todayDate, maximumDuration) : -1;
  const minDate = minimumDuration ? addMonths(todayDate, minimumDuration) : -1;

  const durationList = [
    { text: t("GoalGetter.ShapeGoalScreen.DatePickerModal.sixMonth"), value: 6 },
    { text: t("GoalGetter.ShapeGoalScreen.DatePickerModal.twelveMonths"), value: 12 },
    { text: t("GoalGetter.ShapeGoalScreen.DatePickerModal.twentyFourMonths"), value: 24 },
  ];

  const handleOnChangeDuration = (monthOffset: number) => {
    const newDate = addMonths(monthOffset > 1 ? todayDate : new Date(selectedDate), monthOffset);
    newDate < todayDate
      ? setSelectedDate(format(todayDate, "yyyy-MM-dd"))
      : setSelectedDate(format(newDate, "yyyy-MM-dd"));

    if (maxDate !== -1 && newDate > maxDate) setSelectedDate(format(maxDate, "yyyy-MM-dd"));
    if (minDate !== -1 && newDate < minDate) setSelectedDate(format(minDate, "yyyy-MM-dd"));
  };

  const handleOnPressSetDate = () => {
    onDateSelected(new Date(selectedDate));
    onClose();
  };

  const handleOnMonthSelection = (month: number, year: number) => {
    setIsMonthPickerVisible(false);
    setSelectedDate(format(new Date(year, month, new Date().getDate()), "yyyy-MM-dd"));
  };

  const handleDurationSelect = (durationItem: { text: string; value: number }) => {
    setSelectedDuration(durationItem.text);
    handleOnChangeDuration(durationItem.value);
    onDurationSelect(durationItem);
  };

  const calenderStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderBottomLeftRadius: theme.radii.small,
    borderBottomRightRadius: theme.radii.small,
  }));

  const monthSectionStackStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    padding: theme.spacing["16p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderBottomWidth: 0,
    borderTopRightRadius: theme.radii.small,
    borderTopLeftRadius: theme.radii.small,
  }));

  const calendarBackgroundColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);

  const calendarTextColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  const chevronIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  return (
    <Modal
      onClose={onClose}
      headerText={t("GoalGetter.ShapeGoalScreen.DatePickerModal.title")}
      visible={isVisible}
      testID="goalGetter.component.datePickerModal">
      {withDuration ? (
        <Stack direction="horizontal" gap="16p" justify="center">
          {durationList.map(durationItem => {
            return (
              <Pill
                key={durationItem.text}
                onPress={() => handleDurationSelect(durationItem)}
                isActive={durationItem.text === selectedDuration}>
                {durationItem.text}
              </Pill>
            );
          })}
        </Stack>
      ) : null}
      {!isMonthPickerVisible ? (
        <>
          <Stack direction="horizontal" justify="space-between" style={monthSectionStackStyle}>
            <Pressable
              onPress={() => {
                setIsMonthPickerVisible(true);
              }}>
              <Stack direction="horizontal">
                <Typography.Text size="title3" weight="regular" color="neutralBase+30">
                  {format(new Date(selectedDate), "MMMM yyyy")}
                </Typography.Text>

                {I18nManager.isRTL ? (
                  <ChevronLeftIcon color={chevronIconColor} />
                ) : (
                  <ChevronRightIcon color={chevronIconColor} />
                )}
              </Stack>
            </Pressable>
            <Stack direction="horizontal">
              <Pressable
                onPress={() => {
                  handleOnChangeDuration(-1);
                  setSelectedDuration("");
                }}>
                {I18nManager.isRTL ? (
                  <ChevronRightIcon color={chevronIconColor} />
                ) : (
                  <ChevronLeftIcon color={chevronIconColor} />
                )}
              </Pressable>
              <Pressable
                onPress={() => {
                  handleOnChangeDuration(1);
                  setSelectedDuration("");
                }}>
                {I18nManager.isRTL ? (
                  <ChevronLeftIcon color={chevronIconColor} />
                ) : (
                  <ChevronRightIcon color={chevronIconColor} />
                )}
              </Pressable>
            </Stack>
          </Stack>
          <Calendar
            key={selectedDate}
            minDate={minimumDuration ? format(addMonths(todayDate, minimumDuration), "yyyy-MM-dd") : undefined}
            maxDate={maximumDuration ? format(addMonths(todayDate, maximumDuration), "yyyy-MM-dd") : undefined}
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
              setSelectedDuration("");
            }}
            enableSwipeMonths={true}
            hideArrows={true}
            hideExtraDays={true}
            markingType="custom"
            markedDates={{
              [selectedDate]: {
                customStyles: {
                  container: {
                    borderRadius: 8,
                  },
                },
                selected: true,
                selectedColor: "#EC5F48",
              },
            }}
          />
          <Button onPress={handleOnPressSetDate}>
            {t("GoalGetter.ShapeGoalScreen.DatePickerModal.setDateButton")}
          </Button>
          <Stack direction="vertical" gap="8p" align="stretch">
            <Button variant="tertiary" onPress={onClose}>
              {t("GoalGetter.ShapeGoalScreen.DatePickerModal.cancelButton")}
            </Button>
          </Stack>
        </>
      ) : (
        <MonthPicker
          onChangeMonth={handleOnMonthSelection}
          minimumDuration={minimumDuration}
          maximumDuration={maximumDuration}
        />
      )}
    </Modal>
  );
}
