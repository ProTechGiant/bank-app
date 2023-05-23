import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert as RNAlert, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { FilledRefresh, LargeFilledTickIcon } from "@/assets/icons";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Toast from "@/components/Toast";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import BackgroundBottomStartSvg from "../assets/background-bottom-start.svg";
import BackgroundTopEndSvg from "../assets/background-top-end.svg";
import { CheckAccountSetupPoint } from "../components";
import { useAccountStatus } from "../hooks/query-hooks";
import { Status } from "../types";

const userName = "Sian";

export default function PendingAccountScreen() {
  const { t } = useTranslation();
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isAccountSetupVisible, setIsAccountSetupVisible] = useState(true);
  const [isfetchingAccountStatus, setIsfetchingAccountStatus] = useState(true);
  const { data, refetch } = useAccountStatus(isfetchingAccountStatus);

  const accountStatus: Status | undefined = data?.OnboardingStatus;

  useEffect(() => {
    if (accountStatus === "COMPLETED") {
      setIsfetchingAccountStatus(false);
      const timer = setTimeout(() => {
        setIsBannerVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (accountStatus === "DECLINED") {
      setIsfetchingAccountStatus(false);
    }
  }, [accountStatus, refetch]);

  const handleOnFinishLater = () => {
    RNAlert.alert("Finish Later process not implemented yet. Come back later!");
  };

  const handleAccountSetupToggle = () => {
    setIsAccountSetupVisible(!isAccountSetupVisible);
  };

  const bannerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: theme.palette["warningBase-30"],
    borderRadius: theme.radii.extraSmall,
  }));

  const headerSuccessStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    rowGap: theme.spacing["24p"],
    marginBottom: theme.spacing["24p"],
    width: "100%",
  }));

  const pendingCheckListContainer = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["64p"],
    paddingBottom: theme.spacing["16p"],
  }));

  return (
    <>
      {accountStatus === "COMPLETED" ? (
        <Toast
          message={t("Onboarding.LandingScreen.success.bannerMessage")}
          isVisible={isBannerVisible}
          variant="confirm"
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
            ) : accountStatus === "DECLINED" ? (
              <Stack direction="vertical" gap="16p" align="center" justify="center" flex={1}>
                <Typography.Text color="primaryBase-10" size="large" weight="bold" align="center">
                  {t("Onboarding.LandingScreen.failed.title")}
                </Typography.Text>
                <Typography.Text size="callout" weight="regular" color="primaryBase-10" align="center">
                  {t("Onboarding.LandingScreen.failed.subtitle")}
                </Typography.Text>
              </Stack>
            ) : (
              <Stack direction="vertical" align="center" justify="center" flex={1}>
                <View style={bannerViewStyle}>
                  <Alert
                    color="warningBase-30"
                    icon={<FilledRefresh />}
                    message={t("Onboarding.LandingScreen.pending.bannerMessage")}
                    end={<Alert.ExpandEndButton onPress={handleAccountSetupToggle} expanded={isAccountSetupVisible} />}
                  />
                  {isAccountSetupVisible ? (
                    <Stack direction="vertical" gap="12p" style={pendingCheckListContainer}>
                      <CheckAccountSetupPoint
                        text={t("Onboarding.LandingScreen.pending.accountChecks.identity")}
                        completed={true}
                      />
                      <CheckAccountSetupPoint
                        text={t("Onboarding.LandingScreen.pending.accountChecks.checks")}
                        completed={
                          data &&
                          data.workflowTask &&
                          (data.workflowTask.Name === "WaitingEDDResult" ||
                            data.workflowTask.Name === "AccountCreation" ||
                            data.workflowTask.Name === "RetryAccountCreation")
                            ? true
                            : false
                        }
                      />
                      <CheckAccountSetupPoint
                        text={t("Onboarding.LandingScreen.pending.accountChecks.creatingAccount")}
                        completed={false}
                      />

                      <Typography.Text size="footnote">
                        {t("Onboarding.LandingScreen.pending.footerMessage")}
                      </Typography.Text>
                    </Stack>
                  ) : null}
                </View>
                <Typography.Text size="large" weight="bold" color="primaryBase-10" align="center">
                  {t("Onboarding.LandingScreen.pending.title", { userName })}
                </Typography.Text>
              </Stack>
            )}
          </>
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
