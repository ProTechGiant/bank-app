import { useState } from "react";
import { FlatList, I18nManager, Pressable, TextStyle, View, ViewStyle } from "react-native";

import { ChevronLeftIcon, ChevronRightIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { spacing } from "@/theme/values";

export const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface TaxInvoiceMonthPickerProps {
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (val: number) => void;
  setSelectedYear: (val: number) => void;
}

export default function TaxInvoiceMonthPicker({
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
}: TaxInvoiceMonthPickerProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [calendarYear, setCalendarYear] = useState(selectedYear);

  const textStyle = useThemeStyles<TextStyle>(theme => ({ alignSelf: "center", padding: theme.spacing["8p"] }));

  const renderItem = ({ index, item }: { index: number; item: string }) => {
    const handleOnchangeMonth = () => {
      if (calendarYear === currentYear && index > currentMonth) {
        return;
      } else {
        setSelectedMonth(index);
        setSelectedYear(calendarYear);
      }
    };

    const isItSelected = selectedMonth === index && selectedYear === calendarYear;

    return (
      <Pressable
        onPress={handleOnchangeMonth}
        style={isItSelected ? [activeItemBackgroundColorStyle, listItemContainerStyle] : listItemContainerStyle}>
        <Typography.Text
          color={
            isItSelected
              ? "neutralBase-60"
              : calendarYear === currentYear && index > currentMonth
              ? "neutralBase-30"
              : "neutralBase+30"
          }
          style={textStyle}>
          {item.toUpperCase()}
        </Typography.Text>
      </Pressable>
    );
  };

  const monthContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    borderWidth: 1,
    marginVertical: theme.spacing["16p"],
  }));

  const listItemContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    borderRadius: theme.radii.small,
    flex: 1,
    justifyContent: "space-between",
    marginHorizontal: theme.spacing["16p"],
    margin: theme.spacing["8p"],
  }));

  const activeItemBackgroundColorStyle = useThemeStyles<TextStyle>(theme => ({
    backgroundColor: theme.palette.primaryBase,
  }));

  const calendarHeaderViewStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    padding: theme.spacing["16p"],
  }));

  const chevronColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);
  const chevronColorDisabled = useThemeStyles(theme => theme.palette["neutralBase-30"]);

  const flatListContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["48p"],
  }));

  return (
    <>
      <View style={monthContainerStyle}>
        <View style={calendarHeaderViewStyle}>
          <Typography.Text size="title3" weight="regular" color="neutralBase+30">
            {calendarYear}
          </Typography.Text>
          <Stack direction="horizontal" justify="space-between">
            <Pressable onPress={() => setCalendarYear(year => year - 1)} disabled={calendarYear <= currentYear - 5}>
              {I18nManager.isRTL ? (
                <ChevronRightIcon
                  height={spacing["20p"]}
                  color={calendarYear <= currentYear - 5 ? chevronColorDisabled : chevronColor}
                />
              ) : (
                <ChevronLeftIcon
                  height={spacing["20p"]}
                  color={calendarYear <= currentYear - 5 ? chevronColorDisabled : chevronColor}
                />
              )}
            </Pressable>
            <Pressable
              onPress={() => {
                setCalendarYear(year => year + 1);
              }}
              disabled={calendarYear === currentYear}>
              {I18nManager.isRTL ? (
                <ChevronLeftIcon
                  height={spacing["20p"]}
                  color={calendarYear !== currentYear ? chevronColor : chevronColorDisabled}
                />
              ) : (
                <ChevronRightIcon
                  height={spacing["20p"]}
                  color={calendarYear !== currentYear ? chevronColor : chevronColorDisabled}
                />
              )}
            </Pressable>
          </Stack>
        </View>
        <View style={flatListContainerStyle}>
          <FlatList data={Months} numColumns={3} renderItem={renderItem} />
        </View>
      </View>
    </>
  );
}
