import { format, parseISO } from "date-fns";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { STATUS_COLOR_MAPPING, STATUS_REASON_MAPPING } from "../constants";
import { DisputeCaseListItem } from "../types";

interface CaseListItemProps {
  data: DisputeCaseListItem;
}

export default function CaseListItem({ data }: CaseListItemProps) {
  const { t } = useTranslation();

  const dateCreated = useMemo(() => parseISO(data.CreatedOn), [data]);
  const dateClosed = useMemo(() => parseISO(data.ClosedOn), [data]);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.medium,
    borderWidth: 1,
    padding: theme.spacing["16p"],
    flexShrink: 1,
  }));

  return (
    <Stack direction="vertical" style={containerStyle}>
      <Stack justify="space-between" direction="vertical" gap="16p">
        <Stack direction="horizontal" justify="space-between" gap="4p" style={styles.fullWidth}>
          <Typography.Text color="neutralBase+30" size="callout" weight="medium">
            {t("PaymentDisputes.MyCasesLandingScreen.case")}
            {data.CaseNumber}
          </Typography.Text>
          <Typography.Text
            color={STATUS_COLOR_MAPPING[STATUS_REASON_MAPPING[data.CaseNumber]]}
            size="footnote"
            weight="regular">
            {STATUS_REASON_MAPPING[data.StatusReason]}
          </Typography.Text>
        </Stack>
        <Stack direction="horizontal" gap="4p" style={styles.fullWidth} justify="space-between">
          <Typography.Text color="neutralBase-10" size="footnote" weight="regular">
            {t("PaymentDisputes.MyCasesLandingScreen.created")}
            {format(dateCreated, "d MMM yyyy")}
          </Typography.Text>
          {dateClosed ? (
            <Typography.Text color="neutralBase-10" size="footnote" weight="regular">
              {t("PaymentDisputes.MyCasesLandingScreen.closed")}
              {format(dateClosed, "d MMM yyyy")}
            </Typography.Text>
          ) : null}
        </Stack>
      </Stack>
    </Stack>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: "100%",
  },
});
