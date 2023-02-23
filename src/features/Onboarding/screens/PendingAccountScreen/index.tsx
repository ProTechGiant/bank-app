import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StatusBar, View, ViewStyle } from "react-native";

import { FilledCircleTickIcon, FilledRefresh, LargeFilledTickIcon } from "@/assets/icons";
import Banner from "@/components/Banner";
import Button from "@/components/Button";
import DarkOneGradient from "@/components/LinearGradients/GradientBackgrounds";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

type Status = "success" | "pending" | "failed";

export default function PendingAccountScreen() {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(true);

  const accountStatus: Status = "pending";
  const userName = "Sian";

  const contentViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
  }));

  const bannerViewStyle: ViewStyle = {
    position: "absolute",
    top: 0,
    width: "100%",
  };

  const buttonViewStyle: ViewStyle = {
    position: "absolute",
    bottom: 0,
    width: "100%",
  };

  const iconViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  const handleOnFinishLater = () => {
    Alert.alert("Finish Later process not implemented yet. Come back later!");
  };

  const handleShowBanner = () => {
    setShowBanner(false);
  };

  const checkStatus = (currentStatus: Status, checkStatus: Status): boolean => {
    return currentStatus === checkStatus;
  };

  return (
    <DarkOneGradient>
      <Page>
        <StatusBar barStyle="light-content" />
        <View style={contentViewStyle}>
          {checkStatus(accountStatus, "success") && (
            <>
              {showBanner && (
                <View style={bannerViewStyle}>
                  <Banner
                    variant="successBase"
                    icon={<FilledCircleTickIcon />}
                    onClear={handleShowBanner}
                    message={t("Onboarding.LandingScreen.success.bannerMessage")}
                  />
                </View>
              )}
              <Stack direction="vertical" align="center">
                <View style={iconViewStyle}>
                  <LargeFilledTickIcon />
                </View>
                <Typography.Text size="large" weight="bold" color="neutralBase-50" align="center">
                  {t("Onboarding.LandingScreen.success.title")}
                </Typography.Text>
                <Typography.Text size="large" weight="bold" color="neutralBase-50" align="center">
                  {userName}
                </Typography.Text>
              </Stack>
              <View style={buttonViewStyle}>
                <Button variant="primary" color="dark" onPress={handleOnFinishLater}>
                  {t("Onboarding.LandingScreen.buttons.FinishLater")}
                </Button>
              </View>
            </>
          )}
          {checkStatus(accountStatus, "pending") && (
            <>
              {showBanner && (
                <View style={bannerViewStyle}>
                  <Banner
                    variant="warningBase-30"
                    icon={<FilledRefresh />}
                    onClear={handleShowBanner}
                    message={t("Onboarding.LandingScreen.pending.bannerMessage")}
                  />
                </View>
              )}
              <Stack direction="vertical" align="center">
                <Typography.Text size="large" weight="bold" color="neutralBase-50" align="center">
                  {t("Onboarding.LandingScreen.pending.title")}
                </Typography.Text>
                <Typography.Text size="large" weight="bold" color="neutralBase-50" align="center">
                  {userName}
                </Typography.Text>
              </Stack>
            </>
          )}
          {checkStatus(accountStatus, "failed") && (
            <Stack direction="vertical" gap="16p" align="center">
              <Typography.Text size="large" weight="bold" color="neutralBase-50" align="center">
                {t("Onboarding.LandingScreen.failed.title")}
              </Typography.Text>
              <Typography.Text size="callout" weight="bold" color="neutralBase-50" align="center">
                {t("Onboarding.LandingScreen.failed.subtitle")}
              </Typography.Text>
            </Stack>
          )}
        </View>
      </Page>
    </DarkOneGradient>
  );
}
