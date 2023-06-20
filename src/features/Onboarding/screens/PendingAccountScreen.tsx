import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

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

import AccountCreated from "../assets/account-created.svg";
import AccountDeclined from "../assets/account-declined.svg";
import AccountPending from "../assets/account-pending.svg";
import { CheckAccountSetupPoint, WorkGuideCard } from "../components";
import { useOnboardingContext } from "../contexts/OnboardingContext";
import { useAccountStatus } from "../hooks/query-hooks";
import { Status } from "../types";

export default function PendingAccountScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

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
    marginBottom: theme.spacing["16p"],
  }));

  const headerPendingDeclineStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    rowGap: theme.spacing["24p"],
    marginTop: height / 5,
    marginBottom: theme.spacing["24p"],
    width: "100%",
  }));

  const pendingCheckListContainer = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["24p"],
  }));

  const footerMessageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["12p"],
  }));

  const successAlertContainer = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    right: 0,
    zIndex: 100,
    left: 0,
    margin: theme.spacing["20p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["28p"],
    paddingBottom: theme.spacing["20p"],
  }));

  const svgHeight = height * 0.55; // Adjust the height as needed
  const svgWidth = svgHeight * 0.75; // Adjust the aspect ratio as needed

  const handleWorkGuidePress = () => {
    navigation.navigate("Onboarding.WorkGuideModal");
  };

  return (
    <>
      <Page backgroundColor={accountStatus === "COMPLETED" ? "primaryBase" : "neutralBase-60"}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
        <ContentContainer>
          <>
            {accountStatus === "COMPLETED" ? (
              <>
                {isSuccessMessageVisible ? (
                  <View style={successAlertContainer}>
                    <Alert
                      variant="success"
                      message={t("Onboarding.LandingScreen.success.bannerMessage")}
                      end={<Alert.CloseEndButton onPress={() => setIsSuccessMessageVisible(false)} />}
                    />
                  </View>
                ) : null}
                <Stack direction="vertical" flex={1} justify="space-between" gap="24p" align="stretch">
                  <View style={headerSuccessStyle}>
                    <AccountCreated height={svgHeight} width={svgWidth} />
                    <Stack direction="vertical" align="center" gap="8p">
                      <Typography.Text align="center" size="xlarge" weight="bold" color="neutralBase-60">
                        {t("Onboarding.LandingScreen.success.title")}
                      </Typography.Text>
                      <Typography.Text align="center" size="callout" weight="regular" color="neutralBase-60">
                        {t("Onboarding.LandingScreen.success.subtitle")}
                      </Typography.Text>
                    </Stack>
                  </View>
                </Stack>
              </>
            ) : accountStatus === "DECLINED" ? (
              <Stack direction="vertical" gap="16p" align="center" justify="center" flex={1}>
                <Stack direction="vertical" flex={1} justify="flex-start" gap="24p" align="stretch">
                  <View style={headerPendingDeclineStyle}>
                    <AccountDeclined />
                    <Stack direction="vertical" align="center" gap="8p">
                      <Typography.Text size="title1" weight="bold" color="neutralBase+30" align="center">
                        {t("Onboarding.LandingScreen.failed.title")}
                      </Typography.Text>
                      <Typography.Text size="callout" weight="regular" color="primaryBase-10" align="center">
                        {t("Onboarding.LandingScreen.failed.subtitle")}
                      </Typography.Text>
                    </Stack>
                  </View>
                </Stack>
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
                <Stack direction="vertical" flex={1} justify="flex-start" gap="24p" align="stretch">
                  <View style={headerPendingDeclineStyle}>
                    <AccountPending />
                    <View style={styles.usernameContainer}>
                      <Typography.Text size="title1" weight="bold" color="neutralBase+30" align="center">
                        {t("Onboarding.LandingScreen.pending.title", { userName })}
                      </Typography.Text>
                    </View>
                  </View>
                </Stack>
                <WorkGuideCard onPress={handleWorkGuidePress} />
              </Stack>
            )}
            {accountStatus !== "DECLINED" ? (
              <View style={buttonContainerStyle}>
                <Button
                  color={accountStatus !== "COMPLETED" ? "light" : "dark"}
                  onPress={handleOnGetStartedPress}
                  disabled={accountStatus !== "COMPLETED"}>
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
  bannerViewStyle: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1,
  },
  usernameContainer: {
    alignItems: "center",
    gap: 24,
    justifyContent: "center",
  },
});
