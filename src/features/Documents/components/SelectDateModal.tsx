import { addDays, format, isToday, parseISO, subDays } from "date-fns";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Button from "@/components/Button";
import CustomCalendar from "@/components/CustomCalendar";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { isDateBeforeOnboardingDate, isDateOlderThanFiveYears } from "@/utils";

import { DocumentType } from "../constants";
import TaxInvoiceMonthPicker from "./TaxInvoiceMonthPicker";

interface SelectDateModalInterface {
  selectedDate: string | null;
  onPickDate: (date: string) => void;
  onboardingDate?: string;
  documentType?: null | DocumentType;
  setTaxInvoiceMonthYear: (object: { month: number; year: number }) => void;
  taxInvoiceMonthYear: { month: number; year: number } | null;
}

export default function SelectDateModal({
  selectedDate,
  onPickDate,
  onboardingDate,
  documentType,
  setTaxInvoiceMonthYear,
  taxInvoiceMonthYear,
}: SelectDateModalInterface) {
  const { t } = useTranslation();

  const [date, setDate] = useState<string>(selectedDate ? selectedDate : format(subDays(new Date(), 1), "yyyy-MM-dd"));
  const [selectedMonth, setSelectedMonth] = useState(
    taxInvoiceMonthYear ? taxInvoiceMonthYear.month : new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState(
    taxInvoiceMonthYear ? taxInvoiceMonthYear.year : new Date().getFullYear()
  );

  const handleDayPress = (day: { dateString: string }) => {
    if (format(new Date(), "yyyy-MM-dd") === day.dateString) return; // We don't want to select the todays Date
    setDate(day.dateString);
  };

  const handleOnSelectNextDay = () => {
    const nextDate = addDays(parseISO(date), 1);
    if (isToday(nextDate)) return; // We don't want to select the todays Date
    setDate(format(nextDate, "yyyy-MM-dd"));
  };

  const customCalendarMarkedDateStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    backgroundColor: theme.palette.primaryBase,
  }));

  const calendarHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: theme.palette["neutralBase-30"],
    padding: theme.spacing["12p"],
  }));

  const chevronIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  return (
    <Stack direction="vertical" gap="24p" align="stretch">
      <Stack direction="vertical" align="stretch">
        {documentType === DocumentType.CONSOLIDATED_TAX_INVOICE ? (
          <TaxInvoiceMonthPicker
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
          />
        ) : (
          <>
            <Stack direction="horizontal" justify="space-between" align="center" style={calendarHeaderStyle}>
              <Typography.Text size="title3" weight="regular" color="neutralBase+30">
                {date ? format(parseISO(date), "d MMM yyyy") : null}
              </Typography.Text>
              <Pressable
                style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
                onPress={handleOnSelectNextDay}>
                <ChevronRightIcon height={20} color={chevronIconColor} />
              </Pressable>
            </Stack>
            <CustomCalendar
              current={date}
              onDayPress={handleDayPress}
              markedDates={{
                [date]: {
                  selected: true,
                  customContainerStyle: customCalendarMarkedDateStyle,
                },
                [new Date().toISOString().split("T")[0]]: { disabled: true },
              }}
              markingType="period"
              showDateRange={false}
            />
          </>
        )}
      </Stack>
      {!isDateOlderThanFiveYears(date) ? (
        <Typography.Text size="footnote" weight="regular" color="errorBase" align="center">
          {t("Documents.RequestDocumentScreen.youCannotRequestDoc")}
        </Typography.Text>
      ) : null}
      {onboardingDate && isDateBeforeOnboardingDate(onboardingDate, date) ? (
        <Typography.Text size="footnote" weight="regular" color="errorBase" align="center">
          {t("Documents.RequestDocumentScreen.cannotRequestDocumentOlderThanOnboarding")}
        </Typography.Text>
      ) : null}
      <Button
        onPress={() => {
          if (documentType === DocumentType.CONSOLIDATED_TAX_INVOICE) {
            setTaxInvoiceMonthYear({ month: selectedMonth, year: selectedYear });
          } else {
            onPickDate(date);
          }
        }}
        disabled={
          (onboardingDate && isDateBeforeOnboardingDate(onboardingDate, date)) || !isDateOlderThanFiveYears(date)
        }>
        {t("Documents.RequestDocumentScreen.pickDate")}
      </Button>
    </Stack>
  );
}
