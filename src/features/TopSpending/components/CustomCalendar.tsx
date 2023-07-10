import { format } from "date-fns";
import { I18nManager, View, ViewStyle } from "react-native";
import { Calendar, CalendarProps } from "react-native-calendars";

import { ChevronRightIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { palette, spacing } from "@/theme/values";

type DateStringObject = { [date: string]: number };

interface RenderHeaderProps {
  date: DateStringObject | string;
}

export default function CustomCalendar({ markingType, onDayPress, markedDates }: CalendarProps) {
  const calendarContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.extraSmall,
    borderWidth: 1,
    marginTop: theme.spacing["16p"],
  }));

  return (
    <Calendar
      style={calendarContainerStyle}
      renderHeader={date => <RenderHeader date={markedDates ?? date} />}
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

const RenderHeader = ({ date }: RenderHeaderProps) => {
  const startDay = Object.keys(date)[0];
  const endDay = Object.keys(date)[Object.keys(date).length - 1];

  const calendarHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    paddingVertical: theme.spacing["10p"],
  }));

  // Check if the dates are valid
  const startDate = new Date(startDay);
  const endDate = new Date(endDay);

  return (
    <View style={calendarHeaderStyle}>
      <View>
        <Typography.Text>
          {startDay !== endDay
            ? format(startDate, "dd") + " - " + format(endDate, "dd MMM yyyy")
            : startDay !== undefined
            ? format(startDate, "dd MMM yyyy")
            : format(new Date(), "MMM yyyy")}
        </Typography.Text>
      </View>
    </View>
  );
};
