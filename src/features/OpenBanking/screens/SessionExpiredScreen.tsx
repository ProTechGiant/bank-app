import React from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Alert from "@/components/Alert";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import AppLockedTemporaryImage from "@/features/SignIn/assets/AppLockedTemporaryImage";
import { useThemeStyles } from "@/theme";

export default function SessionExpiredScreen() {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    paddingHorizontal: theme.spacing["24p"],
    paddingTop: theme.spacing["20p"],
    paddingBottom: theme.spacing["24p"],
    width: "100%",
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <ContentContainer>
        <View style={containerStyle}>
          <View />
          <Stack direction="vertical" gap="24p" align="center">
            <AppLockedTemporaryImage />
            <Typography.Text color="neutralBase+30" weight="bold" size="title1" align="center">
              {t("OpenBanking.SessionExpiredScreen.sessionExpiredMessage")}
            </Typography.Text>
            <Typography.Text color="neutralBase+10" size="callout" align="center">
              {t("OpenBanking.SessionExpiredScreen.tryAgain")}
            </Typography.Text>
            <Alert variant="default" message={t("OpenBanking.SessionExpiredScreen.transferToTpp")} />
          </Stack>
          <View />
        </View>
      </ContentContainer>
    </Page>
  );
}
