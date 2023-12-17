import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TextStyle } from "react-native";

import { Stack, Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import { useToasts } from "@/contexts/ToastsContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { WaitingAppleConnectIllustrationIcon } from "../../assets/icons";

export default function WaitingAppleActivationScreen() {
  const navigation = useNavigation();
  const otpFlow = useOtpFlow();
  const addToast = useToasts();

  useEffect(() => {
    setTimeout(() => {
      try {
        otpFlow.handle({
          action: {
            to: "AllInOneCard.WaitingAppleActivationScreen",
          },
          otpVerifyMethod: "aio-card/addToAppleWallet/otp-validation",
          // TODO: Add otpOptionalParams when api finished from BE team
          otpChallengeParams: {
            OtpId: "sdfds",
          },
          onFinish: async status => {
            if (status === "success") {
              navigation.navigate("AllInOneCard.WelcomeAddedToAppleWalletScreen");
            }
            if (status === "fail") {
              addToast({
                variant: "warning",
                message: t("AllInOneCard.ActivatedCardScreen.subscriptionFailed"),
              });
            }
          },
        });
      } catch (error) {
        warn("All In One Card", "error connecting to Apple Wallet", JSON.stringify(error));
      }
    }, 5000);
  });

  const { t } = useTranslation();
  const containerStyle = useThemeStyles<TextStyle>(theme => ({
    paddingHorizontal: theme.spacing["32p"],
  }));
  return (
    <Page backgroundColor="neutralBase-60" testID="AllInOneCard.WaitingAppleActivationScreen:Page">
      <ContentContainer style={containerStyle} testID="AllInOneCard.WaitingAppleActivationScreen:Page">
        <Stack direction="vertical" align="center" justify="center" flex={1}>
          <Stack direction="vertical" justify="space-between" gap="16p" align="center">
            <Stack direction="vertical" align="center" justify="center">
              <WaitingAppleConnectIllustrationIcon />
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
