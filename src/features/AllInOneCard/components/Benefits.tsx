import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import BenefitsItem from "./BenefitsItem";

export default function Benefits() {
  const { t } = useTranslation();
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
    marginTop: theme.spacing["20p"],
  }));

  return (
    <Stack style={containerStyle} direction="vertical" align="stretch">
      <Typography.Text size="title2" weight="medium">
        {t("AllInOneCard.Dashboard.benefits")}
      </Typography.Text>
      <BenefitsItem />
    </Stack>
  );
}
