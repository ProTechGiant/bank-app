import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import LockIllustration from "../assets/LockIllustration";

export default function HighRiskRequireDocumentScreen() {
  const { t } = useTranslation();
  const { height: screenHeight } = useWindowDimensions();
  const navigation = useNavigation<UnAuthenticatedStackParams>();

  const handleOnNaviagate = () => {
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

  return (
    <Page backgroundColor="neutralBase-60">
      <ContentContainer>
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
          <Button onPress={handleOnNaviagate}>{t("Onboarding.HighRiskRequireDocumentScreen.buttonText")}</Button>
        </Stack>
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
