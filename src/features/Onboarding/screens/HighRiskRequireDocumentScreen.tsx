import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import Page from "@/components/Page";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import DocumentFailedSVG from "../assets/document-failed.svg";
import LockIllustration from "../assets/LockIllustration";
import { HighRiskCaseStatus } from "../constants";
import { useCheckHighRiskStatus } from "../hooks/query-hooks";
import { getHighRiskCaseStatusScreen } from "../utils/get-high-risk-case-status-screen";

export default function HighRiskRequireDocumentScreen() {
  const { t } = useTranslation();
  const { height: screenHeight } = useWindowDimensions();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { data: highRiskStatus, isLoading } = useCheckHighRiskStatus();
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [isDocumentVerificationFailed, setIsDocumentVerificationFailed] = useState<boolean>(false);

  useEffect(() => {
    if (!highRiskStatus?.CaseStatus) return;
    switch (highRiskStatus.CaseStatus) {
      case HighRiskCaseStatus.DOCUMENTS_REQUIRED:
        setIsButtonDisabled(false);
        return;
      case HighRiskCaseStatus.DOCUMENTS_RETURNED:
        setIsDocumentVerificationFailed(true);
        return;
    }
    navigation.navigate(getHighRiskCaseStatusScreen(highRiskStatus.CaseStatus));
  }, [navigation, highRiskStatus]);

  const handleOnNavigate = () => {
    navigation.navigate("Onboarding.UploadDocumentScreen");
  };

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["16p"],
    bottom: 0,
    position: "absolute",
    width: "110%",
    alignSelf: "center",
    paddingHorizontal: theme.spacing["24p"],
    paddingBottom: theme.spacing["4p"],
    paddingTop: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
    justifyContent: "center",
    alignItems: "center",
  }));

  const headingStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["32p"],
  }));

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Page backgroundColor="neutralBase-60">
      <ContentContainer>
        {!isDocumentVerificationFailed ? (
          <>
            <Stack direction="vertical" style={mainContainerStyle}>
              <View style={[styles.rocketMarkContainer, { marginTop: screenHeight * 0.2 }]}>
                <LockIllustration />
              </View>
              <Typography.Text style={headingStyle} size="title1" weight="bold" align="center">
                {t("Onboarding.HighRiskRequireDocumentScreen.title")}
              </Typography.Text>
              <Typography.Text size="callout" align="center" color="neutralBase+10">
                {t("Onboarding.HighRiskRequireDocumentScreen.subTitle")}
              </Typography.Text>
            </Stack>
            <Stack direction="vertical" style={buttonContainerStyle} align="stretch">
              <Button onPress={handleOnNavigate} disabled={isButtonDisabled}>
                {t("Onboarding.HighRiskRequireDocumentScreen.buttonText")}
              </Button>
            </Stack>
          </>
        ) : (
          <>
            {/* Document Verification Failed */}
            <Stack direction="vertical" style={mainContainerStyle}>
              <View style={[styles.rocketMarkContainer, { marginTop: screenHeight * 0.2 }]}>
                <DocumentFailedSVG />
              </View>
              <Typography.Text style={headingStyle} size="title1" weight="bold" align="center">
                {t("Onboarding.HighRiskRequireDocumentScreen.verificationFailed")}
              </Typography.Text>
              <Typography.Text size="callout" align="center" color="neutralBase+10">
                {t("Onboarding.HighRiskRequireDocumentScreen.reUploadDoc")}
              </Typography.Text>
            </Stack>
            <Stack direction="vertical" style={buttonContainerStyle} align="stretch">
              <Button onPress={handleOnNavigate}>
                {t("Onboarding.HighRiskRequireDocumentScreen.reUploadButtonTitle")}
              </Button>
            </Stack>
          </>
        )}
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  rocketMarkContainer: {
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: 15 }],
    width: "100%",
  },
});
