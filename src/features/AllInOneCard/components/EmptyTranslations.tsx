import React from "react";
import { useTranslation } from "react-i18next";
import { Image, ImageStyle } from "react-native";

import { Stack, Typography } from "@/components";
import useThemeStyles from "@/theme/use-theme-styles";

import EmptyTranslation from "../assets/images/EmptyTranslation.png";

export default function EmptyTranslations() {
  const { t } = useTranslation();

  const ImageContainer = useThemeStyles<ImageStyle>(theme => ({
    marginBottom: theme.spacing["12p"],
  }));

  return (
    <Stack direction="vertical" justify="center" align="center" flex={1} gap="4p">
      <Image source={EmptyTranslation} style={ImageContainer} />
      <Typography.Text size="callout" weight="medium" color="neutralBase+30">
        {t("AllInOneCard.Dashboard.emptyTranslations.NoTransactionsYet")}
      </Typography.Text>
      <Typography.Text size="footnote" weight="regular" color="neutralBase">
        {t("AllInOneCard.Dashboard.emptyTranslations.description")}
      </Typography.Text>
    </Stack>
  );
}
