import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, StatusBar, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import Alert from "@/components/Alert";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

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

  const { userName } = useOnboardingContext();
  const [isAccountSetupVisible, setIsAccountSetupVisible] = useState(false);
  const [isfetchingAccountStatus, setIsfetchingAccountStatus] = useState(true);
  const { data, refetch } = useAccountStatus(isfetchingAccountStatus);

  const accountStatus: Status | undefined = data?.OnboardingStatus as Status;

  useEffect(() => {
    if (accountStatus === "COMPLETED") {
      setIsfetchingAccountStatus(false);
      navigation.navigate("Onboarding.CreatePasscode");
    } else if (accountStatus === "DECLINED") {
      setIsfetchingAccountStatus(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountStatus, refetch]);

  useFocusEffect(
    useCallback(() => {
      const handleOnBackButtonClick = () => {
        //We do not want anything to happen here so we are returning, it was giving the default behavior and was going back
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", handleOnBackButtonClick);

      return () => BackHandler.removeEventListener("hardwareBackPress", handleOnBackButtonClick);
    }, [])
  );

  const handleWorkGuidePress = () => {
    navigation.navigate("Onboarding.WorkGuideModal");
  };

  const handleAccountSetupToggle = () => {
    setIsAccountSetupVisible(!isAccountSetupVisible);
  };

  const headerPendingDeclineStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    rowGap: theme.spacing["24p"],
    marginTop:
      height / 5 - // calculation to get 20% of screen height
      theme.spacing["20p"], // remove ContentContainer Padding
    marginBottom: theme.spacing["24p"],
    width: "100%",
    paddingHorizontal: theme.spacing["32p"],
  }));

  const pendingCheckListContainer = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["24p"],
  }));

  const footerMessageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["12p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["32p"],
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
        <ContentContainer>
          <>
            {accountStatus === "DECLINED" ? (
              <Stack direction="vertical" gap="16p" align="center" justify="center" flex={1}>
                <Stack direction="vertical" flex={1} justify="flex-start" gap="24p" align="stretch">
                  <View style={headerPendingDeclineStyle}>
                    <AccountDeclined />
                    <Stack direction="vertical" align="center" gap="8p">
                      <Typography.Text size="title1" weight="bold" color="neutralBase+30" align="center">
                        {t("Onboarding.LandingScreen.failed.title")}
                      </Typography.Text>
                      <Typography.Text size="callout" weight="regular" color="neutralBase+10" align="center">
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
                <View style={buttonContainerStyle}>
                  <WorkGuideCard onPress={handleWorkGuidePress} />
                </View>
              </Stack>
            )}
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
