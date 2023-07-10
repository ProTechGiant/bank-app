import { FlatList, I18nManager, Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { Months } from "../mocks/monthListData";

interface MonthPickerProps {
  selectedMonth: number;
  selectedYear: number;
  onChangeMonth: (value: number) => void;
  onChangeYear: (value: number) => void;
  selectSecondMonth: boolean;
}
interface HeaderProps {
  selectedMonth: number;
  onChangeMonth: (value: number) => void;
  onChangeYear: (value: number) => void;
  selectedYear: number;
}
interface SubHeaderProps {
  year: number;
  setYear(value: number): void;
}
export default function MonthPicker({
  selectedMonth,
  selectedYear,
  onChangeMonth,
  onChangeYear,
  selectSecondMonth,
}: MonthPickerProps) {
  const activeListItemContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["primaryBase-40"],
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
    height: "55%",
    marginTop: theme.spacing["16p"],
    width: "92%",
  }));

  const selectedMonthColor = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.complimentBase,
  }));

  const renderItem = ({ index, item }: { index: number; item: string }) => {
    return (
      <Pressable
        onPress={() => onChangeMonth(index)}
        style={
          selectedMonth - 1 === index
            ? [selectSecondMonth ? [activeListItemContainerStyle, selectedMonthColor] : activeListItemContainerStyle]
            : listItemContainerStyle
        }>
        <Typography.Text color={selectedMonth - 1 === index ? "neutralBase-60" : "neutralBase+30"} style={textStyle}>
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
      <SubHeader year={selectedYear} setYear={onChangeYear} />
      <View style={styles.flatListContainer}>
        <FlatList contentContainerStyle={styles.listContainer} data={Months} numColumns={3} renderItem={renderItem} />
      </View>
    </View>
  );
}

const Header = ({ selectedMonth, onChangeMonth, selectedYear }: HeaderProps) => {
  const onRightArrowClick = () => {
    onChangeMonth(selectedMonth === 12 ? 0 : selectedMonth);
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
      <Pressable onPress={onRightArrowClick}>
        <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
          <ChevronRightIcon height={20} color={chevronColor} />
        </View>
      </Pressable>
    </View>
  );
};

const SubHeader = ({ year, setYear }: SubHeaderProps) => {
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
      <Pressable onPress={() => setYear(year - 1)}>
        <View style={{ transform: [{ scaleX: I18nManager.isRTL ? 1 : -1 }] }}>
          <ChevronRightIcon height={16} color={chevronColor} />
        </View>
      </Pressable>
      <Typography.Text size="caption2" weight="medium" color="neutralBase+30">
        {year}
      </Typography.Text>
      <Pressable onPress={() => setYear(year + 1)}>
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
