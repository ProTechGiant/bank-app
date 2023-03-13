import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { FilledCircleTickIcon, FilledRefresh, LargeFilledTickIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import DismissibleBanner from "@/components/DismissibleBanner";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import BackgroundBottomStartSvg from "./background-bottom-start.svg";
import BackgroundTopEndSvg from "./background-top-end.svg";
import useAccountStatus, { Status } from "./use-account-status";

const userName = "Sian";

export default function PendingAccountScreen() {
  const { t } = useTranslation();
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const { data } = useAccountStatus();

  const accountStatus: Status | undefined = data?.OnboardingStatus;

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

  const headerSuccessStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    rowGap: theme.spacing["24p"],
    marginBottom: theme.spacing["24p"],
    width: "100%",
  }));

  return (
    <>
      {accountStatus === "COMPLETED" ? (
        <DismissibleBanner
          onClearPress={() => setIsBannerVisible(false)}
          icon={<FilledCircleTickIcon />}
          message={t("Onboarding.LandingScreen.success.bannerMessage")}
          visible={isBannerVisible}
        />
      ) : accountStatus === "PENDING" ? (
        <DismissibleBanner
          onClearPress={() => setIsBannerVisible(false)}
          icon={<FilledRefresh />}
          message={t("Onboarding.LandingScreen.pending.bannerMessage")}
          visible={isBannerVisible}
        />
      ) : null}
      <Page>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
        <View style={styles.backgroundTopEnd}>
          <BackgroundTopEndSvg />
        </View>
        <View style={styles.backgroundBottomStart}>
          <BackgroundBottomStartSvg />
        </View>
        <ContentContainer>
          {accountStatus ? (
            <>
              {accountStatus === "COMPLETED" ? (
                <>
                  <Stack direction="vertical" flex={1} justify="space-between">
                    <View />
                    <View style={headerSuccessStyle}>
                      <LargeFilledTickIcon />
                      <Typography.Text align="center" size="large" weight="bold" color="primaryBase-10">
                        {t("Onboarding.LandingScreen.success.title", { userName })}
                      </Typography.Text>
                    </View>
                    <Button block variant="primary" onPress={handleOnFinishLater}>
                      {t("Onboarding.LandingScreen.buttons.FinishLater")}
                    </Button>
                  </Stack>
                </>
              ) : accountStatus === "PENDING" ? (
                <Stack direction="vertical" align="center" justify="center" flex={1}>
                  <Typography.Text size="large" weight="bold" color="primaryBase-10" align="center">
                    {t("Onboarding.LandingScreen.pending.title", { userName })}
                  </Typography.Text>
                </Stack>
              ) : (
                <Stack direction="vertical" gap="16p" align="center" justify="center" flex={1}>
                  <Typography.Text color="primaryBase-10" size="large" weight="bold" align="center">
                    {t("Onboarding.LandingScreen.failed.title")}
                  </Typography.Text>
                  <Typography.Text size="callout" weight="regular" color="primaryBase-10" align="center">
                    {t("Onboarding.LandingScreen.failed.subtitle")}
                  </Typography.Text>
                </Stack>
              )}
            </>
          ) : (
            <Stack direction="vertical" gap="16p" align="center" justify="center" flex={1}>
              <Typography.Text color="primaryBase-10" size="large" weight="bold" align="center">
                {t("Onboarding.LandingScreen.failed.title")}
              </Typography.Text>
              <Typography.Text size="callout" weight="regular" color="primaryBase-10" align="center">
                {t("Onboarding.LandingScreen.failed.subtitle")}
              </Typography.Text>
            </Stack>
          )}
        </ContentContainer>
      </Page>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundBottomStart: {
    bottom: 0,
    position: "absolute",
    start: 0,
  },
  backgroundTopEnd: {
    end: 0,
    position: "absolute",
    top: 0,
  },
});
