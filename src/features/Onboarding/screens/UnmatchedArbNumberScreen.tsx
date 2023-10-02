import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import FullScreenLoader from "@/components/FullScreenLoader";
import InfoModal from "@/components/InfoModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useOpenLink from "@/hooks/use-open-link";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useOnboardingContext } from "../contexts/OnboardingContext";
import { useCheckCustomerSelectionForMobileNumber, useGetArbMicrositeUrl } from "../hooks/query-hooks";
import { getActiveTask } from "../utils/get-active-task";

export default function UnmatchedArbNumberScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { nationalId, fetchLatestWorkflowTask, setIsLoading, isLoading } = useOnboardingContext();
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const { mutateAsync: mutateCheckCustomerMobileNumber } = useCheckCustomerSelectionForMobileNumber();
  const { refetch: refetchArbMicrositeUrl } = useGetArbMicrositeUrl();
  const openLink = useOpenLink();

  const handleOnValidateArbNo = async (type: "FOB" | "NORMAL") => {
    if (!nationalId) return;
    try {
      if (type === "FOB") {
        setIsLoading(true);
        await mutateCheckCustomerMobileNumber({ IsSameMobileNumber: "false" });
        setIsLoading(false);
      }
      const workflowTask = await fetchLatestWorkflowTask();

      if (workflowTask?.Name === "GetMicrositeAuthStep") {
        setIsLoading(true);
        const { data: arbMicrositeUrl } = await refetchArbMicrositeUrl();
        setIsLoading(false);
        if (arbMicrositeUrl?.ArbMicrositeUrl) {
          try {
            await openLink(arbMicrositeUrl.ArbMicrositeUrl);
            setIsLoading(true);
            const norWorkflowTask = await fetchLatestWorkflowTask();
            setIsLoading(false);
            navigation.navigate(getActiveTask(norWorkflowTask?.Name ?? ""));
          } catch (err) {
            Alert.alert("Please try again later.");
          }
        }
      } else {
        const normalOnboardingFlow = await fetchLatestWorkflowTask();
        navigation.navigate(getActiveTask(normalOnboardingFlow?.Name ?? ""));
      }
    } catch (error) {
      warn("", JSON.stringify(error));
    }
  };

  const bottomSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    marginBottom: theme.spacing["16p"],
  }));

  const spotIllustrationStyle = useThemeStyles<ViewStyle>(theme => ({
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: theme.palette.complimentBase,
    paddingHorizontal: theme.spacing["8p"],
  }));

  const mainTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginHorizontal: theme.spacing["64p"],
  }));

  const infoIconColor = useThemeStyles(theme => theme.palette["primaryBase-30"]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Page backgroundColor="neutralBase-60">
      <Stack direction="vertical" align="stretch" justify="space-between" flex={1}>
        <Stack direction="vertical" align="center" justify="center" gap="24p" flex={1}>
          <View style={spotIllustrationStyle}>
            <Typography.Text
              size="body"
              weight="bold"
              color="neutralBase-60"
              align="center"
              numberOfLines={3}
              adjustsFontSizeToFit={true}>
              {t("Onboarding.UnmatchedArbNumber.spotIllustration")}
            </Typography.Text>
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
              weight="regular"
              color="primaryBase-30"
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
        isVisible={isInfoModalVisible}
        onClose={() => setIsInfoModalVisible(false)}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  regularTextStyle: { textDecorationLine: "underline" },
});
