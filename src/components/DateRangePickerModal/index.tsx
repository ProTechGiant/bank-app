import { addDays, addMonths, format, isBefore, isSameDay } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, View, ViewStyle } from "react-native";
import { Calendar } from "react-native-calendars";
import { MarkingProps } from "react-native-calendars/src/calendar/day/marking";
import { MarkedDates } from "react-native-calendars/src/types";

import { ChevronRightIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { palette, radii, spacing } from "@/theme/values";

import MonthPicker from "./MonthPicker";

interface DateRangePickerProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (startDate: string, endDate: string) => void;
}

export default function DateRangePickerModal({ isVisible, onClose, onConfirm }: DateRangePickerProps) {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDay, setStartDay] = useState<string | undefined>();
  const [endDay, setEndDay] = useState<string | undefined>(undefined);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);

  const onDayPress = (day: { dateString: string }) => {
    if (startDay && !endDay) {
      const date: { [key: string]: MarkingProps } = {};
      for (
        let startDate = new Date(startDay);
        isBefore(startDate, new Date(day.dateString)) || isSameDay(startDate, new Date(day.dateString));
        startDate = addDays(startDate, 1)
      ) {
        const formattedDate = format(startDate, "yyyy-MM-dd");
        date[formattedDate] = {
          color: palette["secondary_blueBase-20"],
          textColor: palette["neutralBase+30"],
          customContainerStyle: {
            borderRadius: radii.extraSmall,
          },
        };

        if (formattedDate === startDay) date[formattedDate].startingDay = true;
        if (formattedDate === day.dateString) date[formattedDate].endingDay = true;
      }

      setMarkedDates(date);
      setEndDay(day.dateString);
    } else {
      setStartDay(day.dateString);
      setEndDay(undefined);
      setMarkedDates({
        [day.dateString]: {
          startingDay: true,
          endingDay: true,
          color: palette["secondary_blueBase-20"],
          textColor: palette["neutralBase+30"],
          customContainerStyle: {
            borderRadius: radii.extraSmall,
          },
        },
      });
    }
  };

  const handleOnMonthSelection = (month: number, year: number) => {
    setIsMonthPickerVisible(false);
    setSelectedDate(new Date(year, month));
  };

  const onHeaderSelect = () => {
    setIsMonthPickerVisible(true);
  };

  const handleOnCloseModal = () => {
    setStartDay(undefined);
    setEndDay(undefined);
    setMarkedDates({});
    setIsMonthPickerVisible(false);
    setSelectedDate(new Date());
    onClose();
  };

  const handleOnScrollMonth = (scrollValue: number) => {
    setSelectedDate(prevValue => addMonths(prevValue, scrollValue));
  };

  const handleOnConfirm = () => {
    if (startDay !== undefined && endDay !== undefined) {
      onConfirm(startDay, endDay);
      handleOnCloseModal();
    }
  };

  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    borderWidth: 1,
    marginBottom: theme.spacing["16p"],
  }));

  const calendarContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    marginBottom: theme.spacing["8p"],
    height: 320,
  }));

  const calendarHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    borderBottomWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    padding: theme.spacing["16p"],
  }));

  return (
    <Modal visible={isVisible} headerText={t("DateRangePicker.title")} onClose={handleOnCloseModal} style={modalStyle}>
      {!isMonthPickerVisible ? (
        <>
          <View style={containerStyle}>
            <View style={calendarHeaderStyle}>
              <RenderHeader
                scrollMonth={handleOnScrollMonth}
                startDay={startDay}
                endDay={endDay}
                selectedDate={selectedDate}
                onHeaderSelect={onHeaderSelect}
              />
            </View>
            <Calendar
              style={calendarContainerStyle}
              current={format(selectedDate, "yyyy-MM-dd")}
              key={format(selectedDate, "yyyy-MM-dd")}
              renderHeader={_date => <></>}
              markingType="period"
              onDayPress={onDayPress}
              markedDates={markedDates}
              maxDate={format(new Date(), "yyyy-MM-dd")}
              hideArrows
              hideExtraDays
              theme={{
                calendarBackground: palette.transparent,
              }}
            />
          </View>
          <Button disabled={endDay === undefined} onPress={handleOnConfirm}>
            {t("DateRangePicker.confirmButton")}
          </Button>
        </>
      ) : (
        <MonthPicker onChangeMonth={handleOnMonthSelection} />
      )}
    </Modal>
  );
}

interface RenderHeaderProps {
  startDay?: string;
  endDay?: string;
  onHeaderSelect: () => void;
  selectedDate: Date;
  scrollMonth: (scrollValue: number) => void;
}

const RenderHeader = ({ startDay, endDay, onHeaderSelect, selectedDate, scrollMonth }: RenderHeaderProps) => {
  const currentMonth = new Date().getMonth();
  const selectedMonth = selectedDate.getMonth();
  const currentYear = new Date().getFullYear();
  const selectedYear = selectedDate.getFullYear();

  let selectedDateRange = "-";
  if (startDay !== undefined) {
    const startDate = new Date(startDay);
    selectedDateRange = `${format(startDate, "dd MMM yyyy")} -`;
    if (endDay !== undefined) {
      const endDate = new Date(endDay);
      if (!isBefore(endDate, startDate)) {
        selectedDateRange += ` ${format(endDate, "dd MMM yyyy")}`;
      }
    }
  }

  const dateRangeStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["20p"],
  }));

  const chevronColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);
  const chevronColorDisabled = useThemeStyles(theme => theme.palette["neutralBase-30"]);

  return (
    <>
      <View style={dateRangeStyle}>
        <Typography.Text>{selectedDateRange}</Typography.Text>
      </View>
      <Stack direction="horizontal" justify="space-between">
        <Pressable onPress={() => onHeaderSelect()}>
          <Stack direction="horizontal" align="center">
            <Typography.Text>{format(selectedDate, "MMM yyyy")}</Typography.Text>
            <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
              <ChevronRightIcon height={spacing["20p"]} color={chevronColor} />
            </View>
          </Stack>
        </Pressable>
        <Stack direction="horizontal">
          <Pressable style={{ transform: [{ scaleX: I18nManager.isRTL ? 1 : -1 }] }} onPress={() => scrollMonth(-1)}>
            <ChevronRightIcon height={spacing["20p"]} color={chevronColor} />
          </Pressable>
          <Pressable
            style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
            onPress={() => scrollMonth(1)}
            disabled={currentYear === selectedYear && selectedMonth >= currentMonth}>
            <ChevronRightIcon
              height={spacing["20p"]}
              color={
                currentYear === selectedYear && selectedMonth >= currentMonth ? chevronColorDisabled : chevronColor
              }
            />
          </Pressable>
        </Stack>
      </Stack>
    </>
  );
};
