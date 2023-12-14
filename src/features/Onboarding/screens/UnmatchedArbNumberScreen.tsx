import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
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

import MatchingIdFound from "../assets/MatchingIdFound";
import { useOnboardingContext } from "../contexts/OnboardingContext";
import {
  useCheckCustomerSelectionForMobileNumber,
  useFinalizeArbStep,
  useFOBStatus,
  useGetArbMicrositeUrl,
} from "../hooks/query-hooks";
import { getActiveTask } from "../utils/get-active-task";

export default function UnmatchedArbNumberScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { nationalId, fetchLatestWorkflowTask } = useOnboardingContext();
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [isErrorModelVisible, setIsErrorModelVisible] = useState(false);
  const { mutateAsync: mutateCheckCustomerMobileNumber } = useCheckCustomerSelectionForMobileNumber();
  const { refetch: refetchArbMicrositeUrl } = useGetArbMicrositeUrl();
  const openLink = useOpenLink();
  const finalizeArbStep = useFinalizeArbStep();
  const [isfetchingAccountStatus, setIsfetchingAccountStatus] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data, refetch } = useFOBStatus(isfetchingAccountStatus);
  const FOBStatus = data?.OnboardingStatus;

  useEffect(() => {
    if (FOBStatus === "COMPLETED") {
      setIsfetchingAccountStatus(false);

      navigation.navigate(getActiveTask(data?.workflowTask?.Name ?? ""));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FOBStatus, refetch]);

  const handleOnValidateArbNo = async (type: "FOB" | "NORMAL") => {
    if (!nationalId) return;

    try {
      setIsLoading(true);

      if (type === "FOB") {
        await mutateCheckCustomerMobileNumber({ IsSameMobileNumber: true });
      } else {
        await mutateCheckCustomerMobileNumber({ IsSameMobileNumber: false });
      }
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
              setIsLoading(false);
              Alert.alert("Please try again later.");
            }
            setIsfetchingAccountStatus(true);
          }
        }
      } else {
        navigation.navigate(getActiveTask(workflowTask?.Name ?? ""));
      }
    } catch (error) {
      setIsErrorModelVisible(true);
      setIsLoading(false);
      warn("onboarding", "Could not process FOB Consent. Error: ", JSON.stringify(error));
    }
  };

  const bottomSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    marginBottom: theme.spacing["16p"],
  }));

  const mainTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginHorizontal: theme.spacing["48p"],
  }));

  const infoIconColor = useThemeStyles(theme => theme.palette["primaryBase-30"]);

  if (isLoading || isfetchingAccountStatus) {
    return <FullScreenLoader />;
  }

  return (
    <Page backgroundColor="neutralBase-60">
      <Stack direction="vertical" align="stretch" justify="space-between" flex={1}>
        <Stack direction="vertical" align="center" justify="center" gap="24p" flex={1}>
          <View>
            <MatchingIdFound />
          </View>
          <Stack direction="vertical" align="center" justify="center" gap="8p" style={mainTextStyle}>
            <Typography.Text size="title1" weight="bold" color="neutralBase+30" align="center">
              {t("Onboarding.UnmatchedArbNumber.matchingIdFound")}
            </Typography.Text>
            <Typography.Text size="callout" weight="regular" color="neutralBase+10" align="center">
              {t("Onboarding.UnmatchedArbNumber.existingAccount")}
              <Pressable onPress={() => setIsInfoModalVisible(true)}>
                <InfoCircleIcon color={infoIconColor} />
              </Pressable>
            </Typography.Text>
          </Stack>
        </Stack>
        <Stack direction="vertical" style={bottomSectionStyle} align="stretch" gap="16p">
          <Button onPress={() => handleOnValidateArbNo("FOB")}>{t("Onboarding.UnmatchedArbNumber.buttonTitle")}</Button>
          <Stack direction="horizontal" align="center" justify="center" gap="4p">
            <Typography.Text size="footnote" weight="regular" color="neutralBase+30">
              {t("Onboarding.UnmatchedArbNumber.buttonDescription")}
            </Typography.Text>
            <Typography.Text
              size="footnote"
              weight="medium"
              color="complimentBase"
              style={styles.regularTextStyle}
              onPress={() => handleOnValidateArbNo("NORMAL")}>
              {t("Onboarding.UnmatchedArbNumber.regularOnboarding")}
            </Typography.Text>
          </Stack>
        </Stack>
      </Stack>
      <InfoModal
        title={t("Onboarding.UnmatchedArbNumber.OnboardingOptionsModal.title")}
        description={t("Onboarding.UnmatchedArbNumber.OnboardingOptionsModal.description")}
        buttonText={t("Onboarding.UnmatchedArbNumber.OnboardingOptionsModal.buttonText")}
        isVisible={isInfoModalVisible}
        onClose={() => setIsInfoModalVisible(false)}
      />
      <NotificationModal
        message={t("Onboarding.FastOnboardingScreen.tryAgain")}
        isVisible={isErrorModelVisible}
        onClose={() => setIsErrorModelVisible(false)}
        title={t("Onboarding.FastOnboardingScreen.errorMessage")}
        variant="error"
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  regularTextStyle: { textDecorationLine: "underline" },
});
