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

interface SelectDateModalInterface {
  selectedDate: string | null;
  onPickDate: (date: string) => void;
  onboardingDate?: string;
}

export default function SelectDateModal({ selectedDate, onPickDate, onboardingDate }: SelectDateModalInterface) {
  const { t } = useTranslation();

  const [date, setDate] = useState<string>(selectedDate ? selectedDate : format(subDays(new Date(), 1), "yyyy-MM-dd"));

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
        <Stack direction="horizontal" justify="space-between" align="center" style={calendarHeaderStyle}>
          <Typography.Text size="title3" weight="regular" color="neutralBase+30">
            {date ? format(parseISO(date), "d MMM yyyy") : null}
          </Typography.Text>
          <Pressable style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }} onPress={handleOnSelectNextDay}>
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
          }}
          markingType="period"
        />
      </Stack>
      {!isDateOlderThanFiveYears(date) ? (
        <Typography.Text size="footnote" weight="regular" color="errorBase" align="center">
          {t("Documents.RequestDocumentScreen.youCannotRequestDoc")}
        </Typography.Text>
      ) : null}
      {onboardingDate && isDateBeforeOnboardingDate(onboardingDate, date) ? (
        <Typography.Text size="footnote" weight="regular" color="errorBase" align="center">
          {t("Documents.RequestDocumentScreen.cannotRequestStatementOlderThanOnboarding")}
        </Typography.Text>
      ) : null}
      <Button
        onPress={() => onPickDate(date)}
        disabled={
          (onboardingDate && isDateBeforeOnboardingDate(onboardingDate, date)) || !isDateOlderThanFiveYears(date)
        }>
        {t("Documents.RequestDocumentScreen.pickDate")}
      </Button>
    </Stack>
  );
}
