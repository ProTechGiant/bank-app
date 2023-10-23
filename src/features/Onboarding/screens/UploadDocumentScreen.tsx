import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, useWindowDimensions, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import { CheckboxInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import UploadDocumentCardList from "../components/UploadDocumentCardList";
import { useCheckHighRiskStatus, useRetriveHighRiskDocumentListByCustomerId } from "../hooks/query-hooks";
import { getHighRiskCaseStatusScreen } from "../utils/get-high-risk-case-status-screen";

export default function UploadDocumentScreen() {
  const { t } = useTranslation();
  const { height: screenHeight } = useWindowDimensions();
  const [isChecked, setIsChecked] = useState(false);
  const { data, isLoading, isError } = useRetriveHighRiskDocumentListByCustomerId();
  const [isErrorModelVisible, setIsErrorModelVisible] = useState<boolean>(isError);
  const navigation = useNavigation();

  const { data: highRiskStatus } = useCheckHighRiskStatus();

  useEffect(() => {
    if (!highRiskStatus?.CaseStatus) return;
    navigation.navigate(getHighRiskCaseStatusScreen(highRiskStatus.CaseStatus));
  }, [navigation, highRiskStatus]);

  useEffect(() => {
    setIsErrorModelVisible(isError);
  }, [isError]);

  const handleOnPress = () => {
    Alert.alert("Function is deprecated");
  };

  const headingStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const checkBoxContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingRight: theme.spacing["32p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["16p"],
    bottom: 0,
    position: "absolute",
    width: "110%",
    alignSelf: "center",
    paddingHorizontal: theme.spacing["24p"],
    paddingBottom: theme.spacing["4p"],
    paddingTop: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-40"],
  }));

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Page>
      <NavHeader />
      <ContentContainer>
        <Typography.Text style={headingStyle} size="title1" weight="medium">
          {t("Onboarding.UploadDocumentScreen.title")}
        </Typography.Text>
        <Typography.Text size="callout" color="neutralBase+10">
          {t("Onboarding.UploadDocumentScreen.subTitle")}
          <InfoCircleIcon />
        </Typography.Text>
        <View style={{ height: screenHeight * 0.68 }}>
          <UploadDocumentCardList documents={data?.RequiredDocuments ?? []} />
        </View>
        <Stack direction="vertical" style={buttonContainerStyle} align="stretch">
          <View style={checkBoxContainerStyle}>
            <CheckboxInput
              value={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              label="I confirm that my documents are accurate and completed"
            />
          </View>
          <Button disabled={!isChecked} onPress={handleOnPress}>
            {t("Onboarding.UploadDocumentScreen.buttonText")}
          </Button>
        </Stack>
        <NotificationModal
          message={t("Onboarding.FastOnboardingScreen.tryAgain")}
          isVisible={isErrorModelVisible}
          onClose={() => {
            setIsErrorModelVisible(false);
            navigation.goBack();
          }}
          title={t("Onboarding.FastOnboardingScreen.errorMessage")}
          variant="error"
        />
      </ContentContainer>
    </Page>
  );
}
