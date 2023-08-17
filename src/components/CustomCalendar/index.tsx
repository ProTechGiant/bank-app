import { format } from "date-fns";
import { useState } from "react";
import { I18nManager, StyleSheet, View, ViewStyle } from "react-native";
import { Calendar, CalendarProps, DateData } from "react-native-calendars";

import { ChevronRightIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { palette, spacing } from "@/theme/values";

type DateStringObject = { [date: string]: number };

interface RenderHeaderProps {
  date: DateStringObject | string;
  currentMonth: Date;
  hideArrows: boolean | undefined;
}

export default function CustomCalendar({ markingType, onDayPress, markedDates, hideArrows }: CalendarProps) {
  const calendarContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.extraSmall,
    borderWidth: 1,
  }));

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleOnMonthChange = (month: DateData) => {
    setCurrentMonth(new Date(month.year, month.month - 1)); // subtract 1 because JavaScript months start from 0
  };

  return (
    <Calendar
      style={calendarContainerStyle}
      current={format(currentMonth, "yyyy-MM-dd")}
      onMonthChange={handleOnMonthChange}
      renderHeader={date => (
        <RenderHeader date={markedDates ?? date} currentMonth={currentMonth} hideArrows={hideArrows} />
      )}
      renderArrow={direction => <RenderArrow direction={direction} />}
      markingType={markingType}
      onDayPress={onDayPress}
      markedDates={markedDates}
      maxDate={format(new Date(), "yyyy-MM-dd")}
      theme={{
        dayTextColor: palette["neutralBase+30"],
        todayTextColor: palette["neutralBase+30"],
        todayButtonFontWeight: "400",
        textDayFontWeight: "400",
        textDayHeaderFontWeight: "500",
      }}
    />
  );
}

const RenderArrow: React.FC<{ direction: string }> = ({ direction }) => {
  const rightIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  return direction === "left" ? (
    <View style={{ transform: [{ scaleX: I18nManager.isRTL ? 1 : -1 }] }}>
      <ChevronRightIcon height={spacing["20p"]} color={rightIconColor} />
    </View>
  ) : (
    <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
      <ChevronRightIcon height={spacing["20p"]} color={rightIconColor} />
    </View>
  );
};

const RenderHeader = ({ date, currentMonth, hideArrows }: RenderHeaderProps) => {
  let startDay, endDay;

  // Check if more than one week is selected
  if (Object.keys(date).length > 7 && !hideArrows) {
    startDay = Object.keys(date)[7]; // Start of second week
    endDay = Object.keys(date)[Object.keys(date).length - 1]; // End of second week
  } else {
    startDay = Object.keys(date)[0]; // Start of first week or single week
    endDay = Object.keys(date)[Object.keys(date).length - 1]; // End of first week or single week
  }

  const calendarHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    justifyContent: "space-between",
    overflow: "hidden",
    paddingVertical: theme.spacing["12p"],
  }));

  // Check if the dates are valid
  const startDate = new Date(startDay);
  const endDate = new Date(endDay);

  // Current viewed month and year
  const currentMonthYear = format(currentMonth, "MMMM yyyy");

  return (
    <View style={calendarHeaderStyle}>
      {startDay !== undefined && endDay !== undefined && startDay !== endDay ? (
        <View>
          <Typography.Text>{format(startDate, "dd MMM yyyy") + " - " + format(endDate, "dd MMM yyyy")}</Typography.Text>
        </View>
      ) : null}
      <View style={styles.monthView}>
        <Typography.Text size="caption1">{currentMonthYear}</Typography.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  monthView: {
    alignItems: "center",
  },
});
