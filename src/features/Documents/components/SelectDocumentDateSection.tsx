import { format, parse } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import InfoBox from "@/components/InfoBox";
import SetMonthRowCard from "@/components/SetMonthRowCard";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface SelectDocumentDateSectionInterface {
  documentDate: string | null;
  onPressSetDate: (isStartDate: boolean) => void;
  selectingMonthYear?: boolean;
  monthYear?: null | { year: number; month: number };
}

export default function SelectDocumentDateSection({
  documentDate,
  onPressSetDate,
  selectingMonthYear,
  monthYear,
}: SelectDocumentDateSectionInterface) {
  const { t } = useTranslation();

  const selectDocumentDateSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    marginTop: theme.spacing["24p"],
  }));

  return (
    <Stack direction="vertical" align="stretch" style={selectDocumentDateSectionStyle} gap="32p">
      <Stack direction="vertical" gap="16p">
        <Typography.Text size="title3" weight="medium" color="neutralBase+30">
          {t("Documents.RequestDocumentScreen.selectDocDate")}
        </Typography.Text>
        <SetMonthRowCard
          label={
            selectingMonthYear
              ? t("Documents.RequestDocumentScreen.monthAndYear")
              : t("Documents.RequestDocumentScreen.selectDate")
          }
          selectedMonth={
            selectingMonthYear
              ? monthYear
                ? `${monthNames[monthYear?.month]} ${monthYear?.year}`
                : null
              : documentDate
              ? format(parse(documentDate, "yyyy-MM-dd", new Date()), "d MMM yyyy")
              : null
          }
          onPressSetDate={() => onPressSetDate(true)}
        />
      </Stack>
      <InfoBox
        borderPosition="start"
        variant="primary"
        title={t("Documents.RequestDocumentScreen.selectDateWithinLast5Years")}
      />
    </Stack>
  );
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
