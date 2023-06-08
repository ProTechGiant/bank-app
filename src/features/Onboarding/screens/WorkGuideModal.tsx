import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import MarkedSvg from "../assets/marked.svg";
import UnlockSVG from "../assets/unlock.svg";
import UnMarkedSvg from "../assets/unmarked.svg";
import { useGetCustomerPendingAction } from "../hooks/query-hooks";

export default function WorkGuideModal() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isLifeStylePreferenceSelected, _] = useState(false); // TODO: replace with real data from API
  const { data: customerPendingActionData } = useGetCustomerPendingAction(1);

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: 0,
    paddingBottom: theme.spacing["14p"],
  }));

  const stackStyle = useThemeStyles<ViewStyle>(theme => ({
    width: theme.spacing.full,
    alignItems: "stretch",
  }));

  const lockIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["30p"],
    alignSelf: "center",
  }));

  const tailerLabelContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["4p"],
    marginHorizontal: theme.spacing["24p"],
  }));

  const selectLifeStyleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: theme.spacing["8p"],
    borderColor: theme.palette["neutralBase-30"],
    alignItems: "center",
    width: theme.spacing.full,
    marginTop: theme.spacing["20p"],
    paddingLeft: theme.spacing["16p"],
    paddingRight: theme.spacing["18p"],
    paddingVertical: theme.spacing["20p"],
    gap: theme.spacing["5p"], // Applied in order to give some spacing between labels and the checkbox
  }));

  const selectLifeStyleInnerLeftContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    gap: theme.spacing["4p"],
  }));

  const handleButtonPress = () => {
    navigation.goBack();
  };

  const handleCardPress = (feature: string) => {
    Alert.alert(t("Onboarding.LandingScreen.lifeStylePreferenceModal.nextBuildCycle", { feature })); //TODO: Navigate to lifestyle later instead of alert
  };

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader title={t("Onboarding.LandingScreen.lifeStylePreferenceModal.topTitle")} withBackButton={false} />
        <ContentContainer style={contentContainerStyle}>
          <Stack direction="vertical" justify="space-between" flex={1}>
            <Stack direction="vertical" style={stackStyle} justify="center" align="center">
              <View style={lockIconContainerStyle}>
                <UnlockSVG />
              </View>
              <View style={tailerLabelContainerStyle}>
                <Typography.Text size="title1" weight="bold" color="primaryBase-10" align="center">
                  {t("Onboarding.LandingScreen.lifeStylePreferenceModal.title")}
                </Typography.Text>
                <Typography.Text size="footnote" weight="regular" color="neutralBase+30" align="center">
                  {t("Onboarding.LandingScreen.lifeStylePreferenceModal.subTitle")}
                </Typography.Text>
              </View>
              {/* TODO: Later will remove slice from below data and get object instead of array */}
              {customerPendingActionData?.slice(1, 2).map((item, index) => (
                <Pressable key={index} onPress={handleCardPress.bind(null, item.MessageText)}>
                  <View style={selectLifeStyleContainerStyle}>
                    <View style={selectLifeStyleInnerLeftContainerStyle}>
                      <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                        {item.MessageText}
                      </Typography.Text>
                      <Typography.Text size="footnote" weight="regular" color="neutralBase-10">
                        {item.Description}
                      </Typography.Text>
                    </View>
                    {isLifeStylePreferenceSelected ? <MarkedSvg /> : <UnMarkedSvg />}
                  </View>
                </Pressable>
              ))}
            </Stack>
            <Stack gap="16p" direction="vertical" align="center" style={stackStyle}>
              <Button onPress={handleButtonPress}>
                {isLifeStylePreferenceSelected
                  ? t("Onboarding.LandingScreen.lifeStylePreferenceModal.finishLaterButton")
                  : t("Onboarding.LandingScreen.lifeStylePreferenceModal.closeButton")}
              </Button>
              <Typography.Text size="caption1" weight="regular" color="neutralBase" align="center">
                {t("Onboarding.LandingScreen.lifeStylePreferenceModal.bottomTitle")}
              </Typography.Text>
            </Stack>
          </Stack>
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}
