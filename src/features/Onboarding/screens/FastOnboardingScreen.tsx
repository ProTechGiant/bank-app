import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import InfoModal from "@/components/InfoModal";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useOpenLink from "@/hooks/use-open-link";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import WelcomeCarouselOne from "../assets/WelcomeCarouselOne";
import { useOnboardingContext } from "../contexts/OnboardingContext";
import { useFinalizeArbStep, useFOBStatus, useGetArbMicrositeUrl, useProceedToFob } from "../hooks/query-hooks";
import { getActiveTask } from "../utils/get-active-task";

export default function FastOnboardingScreen() {
  const { t } = useTranslation();
  const { height: screenHeight } = useWindowDimensions();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { fetchLatestWorkflowTask } = useOnboardingContext();
  const { mutateAsync } = useProceedToFob();
  const finalizeArbStep = useFinalizeArbStep();
  const [isfetchingAccountStatus, setIsfetchingAccountStatus] = useState(false);
  const [isInfoModalVisible, setIsInfoModelVisible] = useState(false);
  const [isErrorModelVisible, setIsErrorModelVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data, refetch } = useFOBStatus(isfetchingAccountStatus);
  const FOBStatus = data?.OnboardingStatus;

  const { refetch: refetchArbMicrositeUrl } = useGetArbMicrositeUrl();
  const openLink = useOpenLink();

  const handleToggleInfoModel = () => {
    setIsInfoModelVisible(!isInfoModalVisible);
  };

  useEffect(() => {
    if (FOBStatus === "COMPLETED") {
      setIsfetchingAccountStatus(false);

      navigation.navigate(getActiveTask(data?.workflowTask?.Name ?? ""));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FOBStatus, refetch]);

  const handleOnFastOnboarding = async (fobConsent: { IsProceedFOB: boolean }) => {
    try {
      setIsLoading(true);
      await mutateAsync(fobConsent);
      const workflowTask = await fetchLatestWorkflowTask();
      if (workflowTask?.Name === "GetMicrositeAuthStep") {
        const { data: arbMicrositeUrl } = await refetchArbMicrositeUrl();

        if (arbMicrositeUrl?.ArbMicrositeUrl) {
          try {
            await openLink(arbMicrositeUrl.ArbMicrositeUrl);
            await finalizeArbStep.mutateAsync({ IsFailedDetected: false, FailureDescription: "" });
            setIsfetchingAccountStatus(true);
          } catch (e) {
            setIsLoading(false);
            try {
              await finalizeArbStep.mutateAsync({
                IsFailedDetected: true,
                FailureDescription: `${e}`,
              });
            } catch (err) {
              Alert.alert("Please try again later.");
            }
            setIsfetchingAccountStatus(true);
          }
        }
      } else {
        navigation.navigate(getActiveTask(workflowTask?.Name ?? ""));
      }
    } catch (error) {
      setIsLoading(false);
      setIsErrorModelVisible(true);
      warn("onboarding", "Could not process FOB Consent. Error: ", JSON.stringify(error));
    }
  };

  const hadingContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["8p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["32p"],
    marginBottom: theme.spacing["16p"],
    gap: theme.spacing["16p"],
    bottom: 0,
    position: "absolute",
    width: "105%",
    alignSelf: "center",
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["4p"],
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  if (isLoading || isfetchingAccountStatus) {
    return <FullScreenLoader />;
  }

  return (
    <Page backgroundColor="neutralBase-60">
      <ContentContainer>
        <View style={[styles.rocketMarkContainer, { marginTop: screenHeight * 0.01 }]}>
          <WelcomeCarouselOne height={screenHeight * 0.5} />
        </View>

        <Typography.Header size="brand" weight="semiBold" align="center" style={hadingContainerStyle}>
          {t("Onboarding.FastOnboardingScreen.title")}
        </Typography.Header>
        <Typography.Text size="callout" weight="regular" color="neutralBase+10" align="center">
          {t("Onboarding.FastOnboardingScreen.subTitle")}
          <Pressable onPress={handleToggleInfoModel}>
            <InfoCircleIcon color="#02977E" />
          </Pressable>
        </Typography.Text>

        <Stack direction="vertical" style={buttonContainerStyle} align="stretch">
          <Button onPress={() => handleOnFastOnboarding({ IsProceedFOB: true })}>
            {t("Onboarding.FastOnboardingScreen.buttonText")}
          </Button>
          <Pressable style={styles.continueText} onPress={() => handleOnFastOnboarding({ IsProceedFOB: false })}>
            <Typography.Text size="footnote" weight="regular">
              {t("Onboarding.FastOnboardingScreen.continueWithText")}{" "}
            </Typography.Text>
            <Typography.Text color="complimentBase" size="footnote" weight="medium" style={styles.underline}>
              {t("Onboarding.FastOnboardingScreen.regularOnboardingText")}
            </Typography.Text>
          </Pressable>
        </Stack>

        <InfoModal
          isVisible={isInfoModalVisible}
          onClose={handleToggleInfoModel}
          title={t("Onboarding.FastOnboardingScreen.modalTitle")}
          description={t("Onboarding.FastOnboardingScreen.modalMessage")}
        />
        <NotificationModal
          message={t("Onboarding.FastOnboardingScreen.tryAgain")}
          isVisible={isErrorModelVisible}
          onClose={() => setIsErrorModelVisible(false)}
          title={t("Onboarding.FastOnboardingScreen.errorMessage")}
          variant="error"
        />
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  continueText: {
    flexDirection: "row",
    justifyContent: "center",
  },
  rocketMarkContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  underline: {
    textDecorationLine: "underline",
  },
});
