import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TextStyle } from "react-native";

import { Stack, Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { RestartIcon } from "../assets/icons";

export default function WaitingActivationScreen() {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("AllInOneCard.WelcomeScreen");
    }, 5000);
  });

  const { t } = useTranslation();
  const containerStyle = useThemeStyles<TextStyle>(theme => ({
    paddingHorizontal: theme.spacing["32p"],
  }));
  return (
    <Page backgroundColor="neutralBase-60">
      <ContentContainer style={containerStyle}>
        <Stack direction="vertical" align="center" justify="center" flex={1}>
          <Stack direction="vertical" justify="space-between" gap="16p" align="center">
            <Stack direction="vertical" align="center" justify="center">
              <RestartIcon />
            </Stack>
            <Typography.Text size="title1" weight="medium" align="center" color="neutralBase+30">
              {t("AllInOneCard.WaitingActivationScreen.title")}
            </Typography.Text>
            <Typography.Text size="callout" weight="regular" align="center" color="neutralBase+10">
              {t("AllInOneCard.WaitingActivationScreen.description")}
            </Typography.Text>
          </Stack>
        </Stack>
      </ContentContainer>
    </Page>
  );
}
