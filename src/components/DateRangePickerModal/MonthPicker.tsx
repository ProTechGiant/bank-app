import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, I18nManager, Pressable, TextStyle, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { spacing } from "@/theme/values";

import { Months } from "./monthListData";

interface MonthPickerProps {
  onChangeMonth: (month: number, year: number) => void;
}

export default function MonthPicker({ onChangeMonth }: MonthPickerProps) {
  const { t } = useTranslation();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const textStyle = useThemeStyles<TextStyle>(theme => ({ alignSelf: "center", padding: theme.spacing["8p"] }));

  const renderItem = ({ index, item }: { index: number; item: string }) => {
    const handleOnchangeMonth = () => {
      if (selectedYear === currentYear && index > currentMonth) {
        return;
      }
      setSelectedMonth(index);
    };

    return (
      <Pressable
        onPress={handleOnchangeMonth}
        style={
          selectedMonth === index ? [activeItemBackgroundColorStyle, listItemContainerStyle] : listItemContainerStyle
        }>
        <Typography.Text
          color={
            selectedMonth === index
              ? "neutralBase-60"
              : selectedYear === currentYear && index > currentMonth
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
            {selectedYear}
          </Typography.Text>
          <Stack direction="horizontal" justify="space-between">
            <Pressable
              onPress={() => setSelectedYear(year => year - 1)}
              style={{ transform: [{ scaleX: I18nManager.isRTL ? 1 : -1 }] }}>
              <ChevronRightIcon height={spacing["20p"]} color={chevronColor} />
            </Pressable>
            <Pressable
              onPress={() => setSelectedYear(year => year + 1)}
              style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
              disabled={selectedYear >= currentYear}>
              <ChevronRightIcon
                height={spacing["20p"]}
                color={selectedYear < currentYear ? chevronColor : chevronColorDisabled}
              />
            </Pressable>
          </Stack>
        </View>
        <View style={flatListContainerStyle}>
          <FlatList data={Months} numColumns={3} renderItem={renderItem} />
        </View>
      </View>
      <Button
        onPress={() => {
          onChangeMonth(selectedMonth, selectedYear);
        }}>
        {t("DateRangePicker.confirmButton")}
      </Button>
    </>
  );
}
