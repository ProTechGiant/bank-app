import { useTranslation } from "react-i18next";
import { StatusBar } from "react-native";

import { Stack, Typography } from "@/components";
import Page from "@/components/Page";

import { LandingOpenBanking } from "../assets/icons";

export default function LinkedSuccessfullyScreen() {
  const { t } = useTranslation();

  return (
    <Page backgroundColor="neutralBase+30" insets={["left", "right", "bottom", "top"]}>
      <StatusBar barStyle="light-content" />
      <Stack direction="vertical" align="center" justify="center" gap="24p">
        <LandingOpenBanking />
        <Stack direction="vertical" gap="8p" align="center" justify="center">
          <Typography.Text color="neutralBase-60" size="xlarge" weight="bold" align="center">
            {t("OpenBanking.LinkedSuccessfullyScreen.accountLinkedSuccessfully")}
          </Typography.Text>
          <Typography.Text align="center" color="neutralBase-60" size="callout" weight="regular">
            {t("OpenBanking.LinkedSuccessfullyScreen.validityOfLink")}
          </Typography.Text>
        </Stack>
      </Stack>
    </Page>
  );
}
