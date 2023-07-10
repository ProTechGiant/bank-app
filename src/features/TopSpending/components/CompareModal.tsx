import { addDays, format } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { MarkedDates } from "react-native-calendars/src/types";

import { ChevronRightIcon } from "@/assets/icons";
import { WithShadow } from "@/components";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { CompareDurationTypes } from "../enum";
import { CompareDatesTypes, DateInterface } from "../types";
import dateFormatter from "../utils/date-formatter";
import CompareByList from "./CompareByList";
import CustomCalendar from "./CustomCalendar";
import MonthPicker from "./MonthPicker";
import YearPicker from "./YearPicker";

interface CompareComponentProps {
  onCompare: (dates: CompareDatesTypes, type: string) => void;
  isVisible: boolean;
  onClose: () => void;
  onBack: () => void;
}

export default function CompareModel({ onCompare, onClose, isVisible, onBack }: CompareComponentProps) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [compareListModal, setCompareListModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<CompareDurationTypes>(CompareDurationTypes.MONTH);
  const [selectedYears, setSelectedYears] = useState<number[]>([currentYear, currentYear]);
  const [selectedMonths, setSelectedMonths] = useState<{ month: number; year: number }[]>([
    { month: 1, year: currentYear },
    { month: 1, year: currentYear },
  ]);
  const [basePeriod, setBasePeriod] = useState<MarkedDates>({});
  const [comparisonPeriod, setComparisonPeriod] = useState<MarkedDates>({});
  const [selectedValues, setSelectedValues] = useState({ start: {}, end: {} });

  const handleOnChangeFilter = (value: CompareDurationTypes) => {
    setBasePeriod({});
    setComparisonPeriod({});
    setActiveFilter(value);
    setSelectedValues({ start: {}, end: {} });
    setCompareListModal(false);
  };

  const handleOnDaySelection = (day: { dateString: string }) => {
    const periodOne = Object.keys(selectedValues.start).length === 0;
    const date = {
      [day.dateString]: {
        selected: true,
        disableTouchEvent: true,
        color: periodOne ? primaryBaseColor : complimentBaseColor,
        customStyles: {
          container: {
            backgroundColor: periodOne ? primaryBaseColor : complimentBaseColor,
            borderRadius: containerRadius,
          },
          text: {
            color: "white",
          },
        },
      },
    };
    const selectedDates = { ...date };
    periodOne ? setBasePeriod(selectedDates) : setComparisonPeriod(selectedDates);
  };

  const handleOnWeekSelection = (day: { dateString: string }) => {
    const periodOne = Object.keys(selectedValues.start).length === 0;

    const startDate = new Date(day.dateString);
    const numberOfDaysToAdd = 6;

    const endDate = addDays(startDate, numberOfDaysToAdd);

    const date: { [key: string]: DateInterface } = {};
    for (let d = new Date(startDate); d <= endDate; d = addDays(d, 1)) {
      const dateStr = format(d, "yyyy-MM-dd");

      date[dateStr] = {
        color: periodOne ? primaryBaseColor : complimentBaseColor,
        textColor: "white",
        disableTouchEvent: true,
        customContainerStyle: {
          borderRadius: 4,
        },
      };

      if (dateStr === day.dateString) {
        date[dateStr].startingDay = true;
      } else if (dateStr === format(endDate, "yyyy-MM-dd") || dateStr === format(startDate, "yyyy-MM-dd")) {
        date[dateStr].endingDay = true;
      }
    }

    periodOne ? setBasePeriod(date) : setComparisonPeriod(date);
  };

  const handleOnMonthSelection = (value: number, type: string) => {
    setSelectedMonths(prevSelectedMonths => {
      const index = Object.keys(selectedValues.start).length;
      const updatedMonths = [...prevSelectedMonths];
      if (type === "year") updatedMonths[index].year = value;
      else if (type === "month") updatedMonths[index].month = value + 1;
      return [...updatedMonths];
    });
  };

  const handleOnYearSelection = (value: number) => {
    setSelectedYears(preSelectedYears => {
      const index = Object.keys(selectedValues.start).length;
      const updatedMonths = [...preSelectedYears];
      updatedMonths[index] = value;
      return [...updatedMonths];
    });
  };

  const handleOnContinueComparision = () => {
    if (Object.keys(selectedValues.start).length === 0) {
      setSelectedValues({
        ...selectedValues,
        start: Object.keys(basePeriod).length === 0 ? { selectedYears } : { ...basePeriod },
      });
    } else {
      setSelectedValues({ ...selectedValues, end: { ...basePeriod } });
    }

    if (Object.keys(selectedValues.start).length) {
      let date;
      switch (activeFilter) {
        case CompareDurationTypes.MONTH:
          date = dateFormatter(activeFilter, selectedMonths);
          onCompare({ firstDate: date[0], lastDate: date[1] }, activeFilter);
          break;
        case CompareDurationTypes.DAY:
        case CompareDurationTypes.WEEK:
          date = dateFormatter(activeFilter, [basePeriod, comparisonPeriod]);
          onCompare({ firstDate: date[0], lastDate: date[1] }, activeFilter);
          break;
        case CompareDurationTypes.YEAR:
          date = dateFormatter(activeFilter, selectedYears);
          onCompare({ firstDate: date[0], lastDate: date[1] }, activeFilter);
          break;
      }
      onClose();
    }
  };

  const pickButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const compareButtonContainer = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "flex-start",
    alignSelf: "center",
    background: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.extraSmall,
    flexDirection: "row",
    justifyContenr: "center",
    padding: theme.spacing["16p"],
    paddingVertical: theme.spacing["20p"],
  }));

  const selectDateTextStyle = useThemeStyles<TextStyle>(theme => ({
    alignSelf: "center",
    paddingTop: theme.spacing["20p"],
    paddingBottom: theme.spacing["4p"],
  }));

  const modalContainerStyle = useThemeStyles<ViewStyle>(() => ({
    height: 660,
  }));

  const primaryBaseColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);
  const complimentBaseColor = useThemeStyles(theme => theme.palette.complimentBase);
  const neutralBaseColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  const containerRadius = useThemeStyles(theme => theme.radii.extraSmall);

  return (
    <Modal
      style={modalContainerStyle}
      headerText={t("TopSpending.SpendingDateFilter.comparePeriod")}
      visible={isVisible}
      onClose={onClose}
      onBack={onBack}>
      {compareListModal ? (
        <CompareByList activeFilter={activeFilter} onChange={handleOnChangeFilter} />
      ) : (
        <>
          <WithShadow backgroundColor="neutralBase-50" borderRadius="small" elevation={2}>
            <TouchableOpacity onPress={() => setCompareListModal(true)} style={compareButtonContainer}>
              <View style={styles.compareButtonView}>
                <Typography.Text>
                  {t("TopSpending.SpendingDateFilter.compareBy")} {activeFilter}
                </Typography.Text>
                <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
                  <ChevronRightIcon height={20} color={neutralBaseColor} />
                </View>
              </View>
            </TouchableOpacity>
          </WithShadow>
          <View style={selectDateTextStyle}>
            <Typography.Text size="callout" weight="medium">
              {activeFilter === CompareDurationTypes.YEAR
                ? t("TopSpending.SpendingDateFilter.year")
                : t("TopSpending.SpendingDateFilter.date")}
            </Typography.Text>
          </View>
          {activeFilter === "Day" && (
            <CustomCalendar
              markedDates={basePeriod && { ...basePeriod, ...comparisonPeriod }}
              onDayPress={handleOnDaySelection}
              markingType="custom"
            />
          )}
          {activeFilter === "Week" && (
            <CustomCalendar
              markedDates={basePeriod && { ...basePeriod, ...comparisonPeriod }}
              onDayPress={handleOnWeekSelection}
              markingType="period"
            />
          )}

          {activeFilter === "Month" && (
            <MonthPicker
              selectedMonth={selectedMonths[Object.keys(selectedValues.start).length].month}
              selectedYear={selectedMonths[Object.keys(selectedValues.start).length].year}
              onChangeMonth={month => handleOnMonthSelection(month, "month")}
              onChangeYear={year => handleOnMonthSelection(year, "year")}
              selectSecondMonth={Object.keys(selectedValues.start).length !== 0}
            />
          )}
          {activeFilter === "Year" && (
            <YearPicker
              selectedYear={selectedYears[Object.keys(selectedValues.start).length]}
              onChangeYear={handleOnYearSelection}
            />
          )}
          <View style={pickButtonStyle}>
            {!Object.keys(selectedValues.start).length ? (
              <Button
                disabled={!Object.keys(basePeriod).length && activeFilter !== "Year" && activeFilter !== "Month"}
                onPress={handleOnContinueComparision}>
                {t("TopSpending.SpendingDateFilter.continue")}
              </Button>
            ) : (
              <Button
                disabled={!Object.keys(comparisonPeriod).length && activeFilter !== "Year" && activeFilter !== "Month"}
                onPress={handleOnContinueComparision}>
                {t("TopSpending.SpendingDateFilter.compare")}
              </Button>
            )}
          </View>
        </>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  compareButtonView: {
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
