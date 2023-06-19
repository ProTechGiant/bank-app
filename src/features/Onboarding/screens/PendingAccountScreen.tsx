import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToasts } from "@/contexts/ToastsContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { BrandMoment, CheckAccountSetupPoint, WorkGuideCard } from "../components";
import { useOnboardingContext } from "../contexts/OnboardingContext";
import { useAccountStatus } from "../hooks/query-hooks";
import { Status } from "../types";

export default function PendingAccountScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const auth = useAuthContext();
  const { userName } = useOnboardingContext();
  const addToast = useToasts();
  const [isAccountSetupVisible, setIsAccountSetupVisible] = useState(false);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [isfetchingAccountStatus, setIsfetchingAccountStatus] = useState(true);
  const { data, refetch } = useAccountStatus(isfetchingAccountStatus);

  const accountStatus: Status | undefined = data?.OnboardingStatus as Status;

  useEffect(() => {
    if (accountStatus === "COMPLETED") {
      setIsfetchingAccountStatus(false);
      setIsSuccessMessageVisible(true);
    } else if (accountStatus === "DECLINED") {
      setIsfetchingAccountStatus(false);
    }
  }, [accountStatus, refetch, t, addToast]);

  const handleOnGetStartedPress = () => {
    if (auth.userId) auth.authenticate(auth.userId);
  };

  const handleAccountSetupToggle = () => {
    setIsAccountSetupVisible(!isAccountSetupVisible);
  };

  const headerSuccessStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    rowGap: theme.spacing["24p"],
    marginBottom: theme.spacing["24p"],
    width: "100%",
  }));

  const pendingCheckListContainer = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["24p"],
  }));

  const footerMessageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["12p"],
  }));

  const successBrandMomentStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.spacing["100p"],
    backgroundColor: theme.palette.complimentBase,
    width: 150,
    height: 270,
  }));

  const declinedBrandMomentStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.spacing["100p"],
    backgroundColor: theme.palette.complimentBase,
    width: 150,
    height: 45,
  }));

  const pendingBrandMomentStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.spacing["100p"],
    backgroundColor: theme.palette.warningBase,
    width: 150,
    height: 270,
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["28p"],
    paddingBottom: theme.spacing["20p"],
  }));

  const successAlertContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    right: 0,
    zIndex: 100,
    left: 0,
    margin: theme.spacing["20p"],
  }));

  const handleWorkGuidePress = () => {
    navigation.navigate("Onboarding.WorkGuideModal");
  };

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
        <ContentContainer>
          <>
            {accountStatus === "COMPLETED" ? (
              <>
                {isSuccessMessageVisible ? (
                  <View style={successAlertContainerStyle}>
                    <Alert
                      variant="success"
                      message={t("Onboarding.LandingScreen.success.bannerMessage")}
                      end={<Alert.CloseEndButton onPress={() => setIsSuccessMessageVisible(false)} />}
                    />
                  </View>
                ) : null}
                <Stack direction="vertical" flex={1} justify="space-between">
                  <View />
                  <View style={headerSuccessStyle}>
                    <BrandMoment
                      style={successBrandMomentStyle}
                      title="Brand Moment Success"
                      adjustFontSizeToFit={true}
                    />
                    <Typography.Text align="center" size="large" weight="bold" color="primaryBase-10">
                      {t("Onboarding.LandingScreen.success.title", { userName })}
                    </Typography.Text>
                  </View>
                </Stack>
              </>
            ) : accountStatus === "DECLINED" ? (
              <Stack direction="vertical" gap="16p" align="center" justify="center" flex={1}>
                <BrandMoment style={declinedBrandMomentStyle} title="Brand Moment" adjustFontSizeToFit={true} />
                <Typography.Text color="primaryBase-10" size="large" weight="bold" align="center">
                  {t("Onboarding.LandingScreen.failed.title")}
                </Typography.Text>
                <Typography.Text size="callout" weight="regular" color="primaryBase-10" align="center">
                  {t("Onboarding.LandingScreen.failed.subtitle")}
                </Typography.Text>
              </Stack>
            ) : (
              <Stack direction="vertical" align="center" justify="space-between" flex={1}>
                <View style={styles.bannerViewStyle}>
                  <Alert
                    variant="refresh"
                    message={t("Onboarding.LandingScreen.pending.bannerMessage")}
                    end={<Alert.ExpandEndButton onPress={handleAccountSetupToggle} expanded={isAccountSetupVisible} />}
                    isExpanded={isAccountSetupVisible}>
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
                      <Typography.Text size="caption2" style={footerMessageContainerStyle} color="neutralBase+10">
                        {t("Onboarding.LandingScreen.pending.footerMessage")}
                      </Typography.Text>
                    </Stack>
                  </Alert>
                </View>
                <View style={styles.aboveUsernameContainer} />
                <View style={styles.usernameContainer}>
                  <BrandMoment style={pendingBrandMomentStyle} title="Brand Moment Pending" />
                  <Typography.Text size="title1" weight="medium" color="neutralBase+30" align="center">
                    {t("Onboarding.LandingScreen.pending.title", { userName })}
                  </Typography.Text>
                </View>
                <WorkGuideCard onPress={handleWorkGuidePress} />
              </Stack>
            )}
            {accountStatus !== "DECLINED" ? (
              <View style={buttonContainerStyle}>
                <Button onPress={handleOnGetStartedPress} disabled={accountStatus !== "COMPLETED"}>
                  {t("Onboarding.LandingScreen.pending.buttonTitle")}
                </Button>
              </View>
            ) : null}
          </>
        </ContentContainer>
      </Page>
    </>
  );
}

const styles = StyleSheet.create({
  aboveUsernameContainer: { flex: 1 },
  bannerViewStyle: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1,
  },
  usernameContainer: { alignItems: "center", flex: 4, gap: 24, justifyContent: "center" },
});
