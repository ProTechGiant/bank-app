import { addDays, format, isBefore, isSameDay } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { View, ViewStyle } from "react-native";
import { MarkedDates } from "react-native-calendars/src/types";

import CustomCalendar from "@/components/CustomCalendar";
import { useThemeStyles } from "@/theme";
import { palette, radii } from "@/theme/values";

interface TransactionDateProps {
  startDay: string | null;
  setStartDay: (startDay: string | null) => void;
  endDay: string | null;
  setEndDay: (endDate: string | null) => void;
}

export default function TransactionDate({ startDay, setStartDay, endDay, setEndDay }: TransactionDateProps) {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const calendarRef = useRef<any>(null);

  const getMarkedDates = (startDay: string, endDay: string) => {
    const dates: { [key: string]: any } = {};

    for (
      let d = new Date(startDay);
      isBefore(d, new Date(endDay)) || isSameDay(d, new Date(endDay));
      d = addDays(d, 1)
    ) {
      const formattedDate = format(d, "yyyy-MM-dd");
      dates[formattedDate] = {
        color: "#B2D6FF",
        textColor: palette["neutralBase+30"],
        customContainerStyle: {
          borderRadius: radii.small,
        },
      };

      if (formattedDate === startDay) dates[formattedDate].startingDay = true;
      if (formattedDate === endDay) dates[formattedDate].endingDay = true;
    }

    return dates;
  };

  useEffect(() => {
    if (startDay && endDay) {
      setMarkedDates(getMarkedDates(startDay, endDay));
    }
  }, [startDay, endDay]);

  const handleOnDayPressEvent = (day: { dateString: string }) => {
    if (calendarRef.current) {
      calendarRef.current.scrollToMonth(day.dateString);
    }
    if (startDay && !endDay) {
      setMarkedDates(getMarkedDates(startDay, day.dateString));
      setEndDay(day.dateString);
    } else {
      setStartDay(day.dateString);
      setEndDay(null);
      setMarkedDates({
        [day.dateString]: {
          startingDay: true,
          endingDay: true,
          color: "#B2D6FF",
          textColor: palette["neutralBase+30"],
          customContainerStyle: {
            borderRadius: radii.extraSmall,
          },
        },
      });
    }
  };

  const calendarContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["32p"],
  }));

  return (
    <View style={calendarContainerStyle}>
      <CustomCalendar
        markingType="period"
        onDayPress={handleOnDayPressEvent}
        markedDates={markedDates}
        current={startDay ? startDay : ""}
      />
    </View>
  );
}
