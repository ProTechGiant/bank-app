import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { STATUS_COLOR_MAPPING, STATUS_LABEL_MAPPING } from "../constants";

interface CaseStatusRowProps {
  status: string;
}

export default function CaseStatusRow({ status }: CaseStatusRowProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["neutralBase-30"],
    marginVertical: theme.spacing["24p"],
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: theme.radii.small,
    overflow: "hidden",
    padding: theme.spacing["16p"],
    width: "100%",
  }));

  return (
    <Stack direction="horizontal" align="center" gap="16p" style={containerStyle}>
      <Typography.Text size="callout" weight="regular" color="neutralBase+30">
        {t("PaymentDisputes.CaseDetails.status")}
      </Typography.Text>
      <Typography.Text size="callout" weight="medium" color={STATUS_COLOR_MAPPING[status]}>
        {t(STATUS_LABEL_MAPPING[status])}
      </Typography.Text>
    </Stack>
  );
}
