import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TextStyle, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Page from "@/components/Page";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useCheckHighRiskStatus } from "../hooks/query-hooks";
import { getHighRiskCaseStatusScreen } from "../utils/get-high-risk-case-status-screen";

export default function VerifyingInformationScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { data: highRiskStatus } = useCheckHighRiskStatus();

  useEffect(() => {
    if (!highRiskStatus?.CaseStatus) return;
    navigation.navigate(getHighRiskCaseStatusScreen(highRiskStatus.CaseStatus));
  }, [navigation, highRiskStatus]);

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

  const VerifyingInformationTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

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
              {t("Onboarding.VerifyingInformation.spotIllustration")}
            </Typography.Text>
          </View>
          <Stack direction="vertical" align="center" justify="center" gap="8p" style={mainTextStyle}>
            <Typography.Text
              size="title1"
              weight="bold"
              color="neutralBase+30"
              align="center"
              style={VerifyingInformationTextStyle}>
              {t("Onboarding.VerifyingInformation.title")}
            </Typography.Text>
            <Typography.Text size="callout" weight="regular" color="neutralBase+10" align="center">
              {t("Onboarding.VerifyingInformation.description")}
            </Typography.Text>
          </Stack>
        </Stack>
      </Stack>
    </Page>
  );
}
