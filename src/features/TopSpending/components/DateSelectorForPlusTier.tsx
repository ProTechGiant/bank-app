import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { PlusTierDateTypes } from "../types";
import MonthPicker from "./MonthPicker";

interface DateSelectorForPlusTierProps {
  isCompareModal: boolean;
  selectedDates: PlusTierDateTypes[];
  isSecondMonthSelected: boolean;
  openingDate: Date;
  onDateChange: (date: number, type: string) => void;
  onContinue: () => void;
}

export default function DateSelectorForPlusTier({
  isCompareModal,
  isSecondMonthSelected,
  openingDate,
  onDateChange,
  selectedDates,
  onContinue,
}: DateSelectorForPlusTierProps) {
  const { t } = useTranslation();
  const openingYear = openingDate.getFullYear();
  const isReachedToOpeningDate = openingYear === selectedDates[isSecondMonthSelected ? 1 : 0].year;
  const reachedCreationTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["20p"],
  }));

  return (
    <Fragment>
      {isCompareModal ? (
        <MonthPicker
          selectedMonth={selectedDates[isSecondMonthSelected ? 1 : 0].month}
          selectedYear={selectedDates[isSecondMonthSelected ? 1 : 0].year}
          onChangeMonth={item => onDateChange(item, "month")}
          onChangeYear={item => onDateChange(item, "year")}
          selectSecondMonth={isSecondMonthSelected}
          disabledFrom={openingDate}
        />
      ) : (
        <MonthPicker
          selectedMonth={selectedDates[0].month}
          selectedYear={selectedDates[0].year}
          onChangeMonth={item => onDateChange(item, "month")}
          onChangeYear={item => onDateChange(item, "year")}
          selectSecondMonth={false}
          selectedMonthBoxColor="primaryBase"
          disabledFrom={openingDate}
        />
      )}
      <Typography.Text style={reachedCreationTextStyle} size="caption2" color="neutralBase" align="center">
        {isReachedToOpeningDate ? t("TopSpending.TopSpendingScreen.SelectMonthModal.reachedCreation") : null}
      </Typography.Text>
      <Button onPress={onContinue}>
        {isSecondMonthSelected
          ? t("TopSpending.TopSpendingScreen.SelectMonthModal.compare")
          : isCompareModal
          ? t("TopSpending.TopSpendingScreen.SelectMonthModal.continue")
          : t("TopSpending.TopSpendingScreen.SelectMonthModal.select")}
      </Button>
    </Fragment>
  );
}
