import { FlatList, I18nManager, Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { Theme, useThemeStyles } from "@/theme";

import { Months } from "../mocks/monthListData";

interface MonthPickerProps {
  selectedMonth: number;
  selectedYear: number;
  onChangeMonth: (value: number) => void;
  onChangeYear: (value: number) => void;
  selectSecondMonth: boolean;
  selectedMonthBoxColor?: keyof Theme["palette"];
  disabledFrom?: Date;
}
interface HeaderProps {
  selectedMonth: number;
  onChangeMonth: (value: number) => void;
  onChangeYear: (value: number) => void;
  selectedYear: number;
}
interface SubHeaderProps {
  previousButtonDisabledFromDate?: Date;
  year: number;
  setYear(value: number): void;
}

//TODO: will separating this file to components in next BC
export default function MonthPicker({
  selectedMonth,
  selectedYear,
  onChangeMonth,
  onChangeYear,
  selectSecondMonth,
  selectedMonthBoxColor,
  disabledFrom,
}: MonthPickerProps) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const activeListItemContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: selectedMonthBoxColor ? theme.palette[selectedMonthBoxColor] : theme.palette["primaryBase-40"],
    borderRadius: theme.radii.small,
    flex: 1,
    justifyContent: "space-between",
    margin: theme.spacing["4p"],
  }));

  const textStyle = useThemeStyles<TextStyle>(theme => ({ alignSelf: "center", padding: theme.spacing["8p"] }));

  const listItemContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    borderRadius: theme.radii.small,
    flex: 1,
    justifyContent: "space-between",
    margin: theme.spacing["4p"],
  }));

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "center",
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    borderWidth: 1,
    height: 300,
    marginBottom: theme.spacing["24p"],
    marginTop: theme.spacing["16p"],
    width: "92%",
  }));

  const selectedMonthColor = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.complimentBase,
  }));

  const renderItem = ({ index, item }: { index: number; item: string }) => {
    const isDisabled =
      (index >= currentMonth && selectedYear === currentYear) ||
      (disabledFrom
        ? (disabledFrom?.getMonth() > index && selectedYear === disabledFrom.getFullYear()) ||
          selectedYear < disabledFrom.getFullYear()
        : null);
    return (
      <Pressable
        disabled={isDisabled}
        onPress={() => onChangeMonth(index)}
        style={
          selectedMonth - 1 === index
            ? [activeListItemContainerStyle, selectSecondMonth ? selectedMonthColor : null]
            : listItemContainerStyle
        }>
        <Typography.Text
          color={isDisabled ? "neutralBase-20" : selectedMonth - 1 === index ? "neutralBase-60" : "neutralBase+30"}
          style={textStyle}>
          {item.toUpperCase()}
        </Typography.Text>
      </Pressable>
    );
  };

  return (
    <View style={mainContainerStyle}>
      <Header
        onChangeMonth={onChangeMonth}
        selectedYear={selectedYear}
        onChangeYear={onChangeYear}
        selectedMonth={selectedMonth}
      />
      <SubHeader previousButtonDisabledFromDate={disabledFrom} year={selectedYear} setYear={onChangeYear} />
      <View style={styles.flatListContainer}>
        <FlatList contentContainerStyle={styles.listContainer} data={Months} numColumns={3} renderItem={renderItem} />
      </View>
    </View>
  );
}

const Header = ({ selectedMonth, onChangeMonth, selectedYear, onChangeYear }: HeaderProps) => {
  const isNextButtonDisabled = selectedMonth >= new Date().getMonth() + 1 && selectedYear === new Date().getFullYear();
  const onRightArrowClick = () => {
    if (selectedMonth === 12) {
      onChangeYear(selectedYear + 1);
      onChangeMonth(0);
    } else onChangeMonth(selectedMonth);
  };

  const calendarHeaderViewStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    padding: theme.spacing["12p"],
  }));

  const chevronColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  return (
    <View style={calendarHeaderViewStyle}>
      <Typography.Text size="title3" weight="regular" color="neutralBase+30">
        {Months[selectedMonth - 1]} {selectedYear}
      </Typography.Text>
      <Pressable onPress={onRightArrowClick} disabled={isNextButtonDisabled}>
        <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
          <ChevronRightIcon height={20} color={chevronColor} />
        </View>
      </Pressable>
    </View>
  );
};

const SubHeader = ({ previousButtonDisabledFromDate, year, setYear }: SubHeaderProps) => {
  const isNextButtonDisabled = year >= new Date().getFullYear();
  const isPreviousButtonDisabled = previousButtonDisabledFromDate
    ? year <= previousButtonDisabledFromDate.getFullYear()
    : year <= new Date().getFullYear();

  const calendarSubHeaderViewStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    padding: theme.spacing["12p"],
  }));

  const chevronColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  return (
    <View style={calendarSubHeaderViewStyle}>
      <Pressable onPress={() => setYear(year - 1)} disabled={isPreviousButtonDisabled}>
        <View style={{ transform: [{ scaleX: I18nManager.isRTL ? 1 : -1 }] }}>
          <ChevronRightIcon height={16} color={chevronColor} />
        </View>
      </Pressable>
      <Typography.Text size="caption2" weight="medium" color="neutralBase+30">
        {year}
      </Typography.Text>
      <Pressable onPress={() => setYear(year + 1)} disabled={isNextButtonDisabled}>
        <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
          <ChevronRightIcon height={16} color={chevronColor} />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  flatListContainer: { flex: 1 },
  listContainer: { flex: 1 },
});
