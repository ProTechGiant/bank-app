import { parseISO } from "date-fns";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { STATUS_COLOR_MAPPING, STATUS_LABEL_MAPPING } from "../constants";
import { DisputeCaseListItem } from "../types";
import { formatDateTime } from "../utils";

interface CaseListItemProps {
  data: DisputeCaseListItem;
  onPress: () => void;
}

export default function CaseListItem({ data, onPress }: CaseListItemProps) {
  const { t } = useTranslation();
  const date = useMemo(() => parseISO(data.OpenedDate), [data]);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.spacing["16p"],
  }));

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <Stack justify="space-between" direction="vertical" gap="16p">
        <Stack direction="vertical" gap="4p">
          <Typography.Text color="neutralBase+30" size="callout" weight="medium">
            {data.Transaction.Source}
          </Typography.Text>
          <Typography.Text color={STATUS_COLOR_MAPPING[data.CaseStatus]} size="footnote" weight="regular">
            {t(STATUS_LABEL_MAPPING[data.CaseStatus])}
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" gap="4p">
          <Typography.Text color="neutralBase-10" size="footnote" weight="regular">
            {formatDateTime(date)}
          </Typography.Text>
          {data.Transaction.Location !== undefined ? (
            <Typography.Text color="neutralBase-10" size="footnote" weight="regular">
              {data.Transaction.Location}
            </Typography.Text>
          ) : null}
        </Stack>
      </Stack>
      <Typography.Text color="neutralBase+30" size="callout" weight="medium">
        {formatCurrency(Number(data.Transaction.Amount), data.Transaction.Currency)}
      </Typography.Text>
    </Pressable>
  );
}
