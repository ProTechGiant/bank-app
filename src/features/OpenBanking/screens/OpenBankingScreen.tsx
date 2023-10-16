import { useTranslation } from "react-i18next";
import { Image, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Divider from "@/components/Divider";
import Page from "@/components/Page";
import { useThemeStyles } from "@/theme";

export default function OpenBankingScreen() {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
    marginBottom: theme.spacing["20p"],
  }));

  const spacingStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["24p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <View style={containerStyle}>
        <Typography.Text size="title2" weight="medium">
          {t("OpenBanking.OpenBankingScreen.serviceProvider")}
        </Typography.Text>
        <Stack style={spacingStyle} direction="vertical" align="center">
          <Image source={require("../assets/images/top-logo.png")} />
        </Stack>
      </View>
      <Divider color="neutralBase-40" height={4} />
      <View style={containerStyle}>
        <Typography.Text size="title2" weight="medium">
          {t("OpenBanking.OpenBankingScreen.chooseAccpunts")}
        </Typography.Text>
        <Typography.Text size="callout" weight="regular" color="neutralBase+30">
          {t("OpenBanking.OpenBankingScreen.chooseYourAccount")}
        </Typography.Text>
      </View>
      <Divider color="neutralBase-40" height={4} />
    </Page>
  );
}
