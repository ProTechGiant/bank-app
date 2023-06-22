import { addDays, format, isBefore, isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextStyle, ViewStyle } from "react-native";
import { MarkedDates } from "react-native-calendars/src/types";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { palette, radii } from "@/theme/values";

import CustomCalendar from "../screens/CustomCalendar";

interface SpendingsFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onDateChange: (fromDate: string, toDate: string) => void;
}

export default function SpendingsFilterModal({ visible, onClose, onDateChange }: SpendingsFilterModalProps) {
  const { t } = useTranslation();

  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  const [startDay, setStartDay] = useState<string | number | null>(null);
  const [endDay, setEndDay] = useState<string | number | null>(null);

  useEffect(() => {
    setStartDay(null);
    setEndDay(null);
    setMarkedDates({});
  }, [onDateChange]);

  const onDayPressEvent = (day: { dateString: string | number }) => {
    if (startDay && !endDay) {
      const date: { [key: string]: any } = {};
      for (
        let d = new Date(startDay);
        isBefore(d, new Date(day.dateString)) || isSameDay(d, new Date(day.dateString));
        d = addDays(d, 1)
      ) {
        const formattedDate = format(d, "yyyy-MM-dd");
        date[formattedDate] = {
          color: palette.primaryBase,
          textColor: "white",
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
      setEndDay(null);
      setMarkedDates({
        [day.dateString]: {
          startingDay: true,
          endingDay: true,
          color: palette.primaryBase,
          textColor: "white",
          customContainerStyle: {
            borderRadius: radii.extraSmall,
          },
        },
      });
    }
  };

  const modalContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    maxHeight: "85%",
    minHeight: "75%",
  }));

  const warningTextStyle = useThemeStyles<TextStyle>(theme => ({ padding: theme.spacing["16p"], textAlign: "center" }));

  return (
    <Modal
      style={modalContainerStyle}
      headerText={t("TopSpending.SpendingDateFilter.selectDate")}
      visible={visible}
      onClose={onClose}>
      <CustomCalendar hideArrows markingType="period" onDayPress={onDayPressEvent} markedDates={markedDates} />
      <Typography.Text color="neutralBase" size="caption1" weight="regular" style={warningTextStyle}>
        {t("TopSpending.SpendingDateFilter.noTransactionWarning")}
      </Typography.Text>
      <Button
        onPress={() => {
          onClose();
          if (startDay && endDay) {
            onDateChange(startDay.toString(), endDay.toString());
          }
        }}>
        {t("TopSpending.SpendingDateFilter.pickPeriod")}
      </Button>
    </Modal>
  );
}
