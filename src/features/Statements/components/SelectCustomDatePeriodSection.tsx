import { format, parse } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import InfoBox from "@/components/InfoBox";
import SetMonthRowCard from "@/components/SetMonthRowCard";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface SelectCustomDatePeriodSectionProps {
  startDate: string | null;
  endDate: string | null;
  onPressSetDate: (isStartDate: boolean) => void;
}

export default function SelectCustomDatePeriodSection({
  startDate,
  endDate,
  onPressSetDate,
}: SelectCustomDatePeriodSectionProps) {
  const { t } = useTranslation();

  const customDatePeriodSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["32p"],
  }));

  return (
    <Stack direction="vertical" align="stretch" style={customDatePeriodSectionStyle} gap="32p">
      <Stack direction="vertical" gap="16p">
        <Typography.Text size="title3" weight="medium" color="neutralBase+30">
          {t("Statements.RequestStatementScreen.subTitle")}
        </Typography.Text>
        <SetMonthRowCard
          label={t("Statements.RequestStatementScreen.startingDate")}
          selectedMonth={startDate ? format(parse(startDate, "yyyy-MM-dd", new Date()), "d MMM yyyy") : null}
          onPressSetDate={() => onPressSetDate(true)}
        />
        <SetMonthRowCard
          label={t("Statements.RequestStatementScreen.endDate")}
          selectedMonth={endDate ? format(parse(endDate, "yyyy-MM-dd", new Date()), "d MMM yyyy") : null}
          onPressSetDate={() => onPressSetDate(false)}
        />
      </Stack>
      <InfoBox borderPosition="start" variant="primary">
        <Typography.Text size="caption1" weight="regular" color="neutralBase+30">
          {t("Statements.RequestStatementScreen.maximumStatement")}
        </Typography.Text>
      </InfoBox>
    </Stack>
  );
}
