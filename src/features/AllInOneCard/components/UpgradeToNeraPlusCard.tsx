import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, TextStyle, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import useThemeStyles from "@/theme/use-theme-styles";

import UpgradeToNeraPlusImage from "../assets/images/UpgradeToNeraPlusImage.png";

export default function UpgradeToNeraPlusCard() {
  const { t } = useTranslation();
  const amount = 50; // Todo: related to next build cycle
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["20p"],
  }));
  const cardStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: "#1E1A25",
    borderRadius: theme.radii.medium,
    overflow: "hidden",
  }));

  const cardContentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    paddingLeft: theme.spacing["20p"],
  }));
  const textMargin = useThemeStyles<TextStyle>(theme => ({
    marginVertical: theme.spacing["16p"],
  }));

  const buttonContainer = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.xlarge,
    backgroundColor: "#39FDDC",
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["8p"],
    alignSelf: "flex-start",
  }));

  return (
    <View style={containerStyle}>
      <Stack direction="horizontal" style={cardStyle} justify="space-between">
        <View style={cardContentStyle}>
          <Typography.Text color="neutralBase-60" size="callout" weight="medium">
            {t("AllInOneCard.Dashboard.UpgradeToNeraPlusCard.title")}
          </Typography.Text>
          <Stack direction="vertical" style={textMargin} gap="4p">
            <Typography.Text color="neutralBase-60" size="callout" weight="bold">
              {amount} {t("AllInOneCard.Dashboard.UpgradeToNeraPlusCard.currency")}
            </Typography.Text>
            <Typography.Text color="neutralBase-30" size="footnote" weight="regular">
              {t("AllInOneCard.Dashboard.UpgradeToNeraPlusCard.elevateExperience")}
            </Typography.Text>
          </Stack>
          <Pressable style={buttonContainer}>
            <Typography.Text color="neutralBase+30" size="footnote" weight="bold" align="center">
              {t("AllInOneCard.Dashboard.UpgradeToNeraPlusCard.exploreButton")}
            </Typography.Text>
          </Pressable>
        </View>
        <Image source={UpgradeToNeraPlusImage} resizeMode="stretch" />
      </Stack>
    </View>
  );
}
