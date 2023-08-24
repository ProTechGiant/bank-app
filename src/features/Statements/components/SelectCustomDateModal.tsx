import { addDays, format, isToday, parseISO, subDays } from "date-fns";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Button from "@/components/Button";
import CustomCalendar from "@/components/CustomCalendar";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { isDateBeforeOnboardingDate, isDateOlderThanFiveYears, isDateValid } from "../utils";

interface SelectCustomDateModalType {
  isSelectingStartDate: boolean;
  startDate: string | null;
  endDate: string | null;
  selectedDate: string;
  visible: boolean;
  onClose: () => void;
  onPickDate: (isItStartDate: boolean, date: string) => void;
  onboardingDate?: string;
}

export default function SelectCustomDateModal({
  isSelectingStartDate,
  startDate,
  endDate,
  selectedDate,
  visible,
  onClose,
  onPickDate,
  onboardingDate,
}: SelectCustomDateModalType) {
  const { t } = useTranslation();

  const [date, setDate] = useState<string>(selectedDate);

  const customCalendarMarkedDateStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    backgroundColor: theme.palette.primaryBase,
  }));

  const handleDayPress = (day: { dateString: string }) => {
    if (format(new Date(), "yyyy-MM-dd") === day.dateString) return; // We don't want to select the todays Date
    setDate(day.dateString);
  };

  useEffect(() => {
    setDate(selectedDate ? selectedDate : format(subDays(new Date(), 1), "yyyy-MM-dd")); // setting the yesterday's date by default
  }, [selectedDate, visible]);

  const handleOnSelectNextDay = () => {
    const nextDate = addDays(parseISO(date), 1);
    if (isToday(nextDate)) return; // We don't want to select the todays Date
    setDate(format(nextDate, "yyyy-MM-dd"));
  };

  return (
    <Modal
      headerText={
        isSelectingStartDate
          ? t("Statements.RequestStatementScreen.startingDate")
          : t("Statements.RequestStatementScreen.endDate")
      }
      visible={visible}
      onClose={onClose}>
      <Stack direction="vertical" gap="24p" align="stretch">
        <Stack direction="vertical" align="stretch">
          <Header date={date} onPressRightIcon={handleOnSelectNextDay} />
          <CustomCalendar
            current={date}
            onDayPress={handleDayPress}
            markedDates={{
              [date]: {
                selected: true,
                customContainerStyle: customCalendarMarkedDateStyle,
              },
            }}
            markingType="period"
          />
        </Stack>
        {!isDateOlderThanFiveYears(date) ? (
          <Typography.Text size="footnote" weight="regular" color="errorBase" align="center">
            {t("Statements.RequestStatementScreen.cannotRequestAStatementLongerThan5Year")}
          </Typography.Text>
        ) : null}
        {onboardingDate && isDateBeforeOnboardingDate(onboardingDate, date) ? (
          <Typography.Text size="footnote" weight="regular" color="errorBase" align="center">
            {t("Statements.RequestStatementScreen.cannotRequestStatementOlderThanOnboarding")}
          </Typography.Text>
        ) : null}
        {!isSelectingStartDate &&
        !isDateValid(isSelectingStartDate ? date : startDate, isSelectingStartDate ? endDate : date) ? (
          <Typography.Text size="footnote" weight="regular" color="errorBase" align="center">
            {t("Statements.RequestStatementScreen.cannotRequestStatementLongerThan2Years")}
          </Typography.Text>
        ) : null}
        <Button
          onPress={() => onPickDate(isSelectingStartDate, date)}
          disabled={
            (onboardingDate && isDateBeforeOnboardingDate(onboardingDate, date)) ||
            !isDateOlderThanFiveYears(date) ||
            (!isSelectingStartDate &&
              !isDateValid(isSelectingStartDate ? date : startDate, isSelectingStartDate ? endDate : date))
          }>
          {t("Statements.RequestStatementScreen.pickDate")}
        </Button>
      </Stack>
    </Modal>
  );
}

const Header = ({ date, onPressRightIcon }: { date: string; onPressRightIcon: () => void }) => {
  const calendarHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: theme.palette["neutralBase-30"],
    padding: theme.spacing["12p"],
  }));

  const chevronIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  return (
    <Stack direction="horizontal" justify="space-between" align="center" style={calendarHeaderStyle}>
      <Typography.Text size="title3" weight="regular" color="neutralBase+30">
        {date ? format(parseISO(date), "d MMM yyyy") : null}
      </Typography.Text>
      <Pressable style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }} onPress={onPressRightIcon}>
        <ChevronRightIcon height={20} color={chevronIconColor} />
      </Pressable>
    </Stack>
  );
};
