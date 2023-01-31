import { useTranslation } from "react-i18next";
import { Platform, Pressable, ScrollView, Share, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ShareIcon } from "@/assets/icons";
import Button from "@/components/Button";
import InfoBox from "@/components/InfoBox";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import HowItWorksStepCard from "./HowItWorksStepCard";

export default function HowItWorksModal() {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      margin: theme.spacing.regular,
    }),
    []
  );
  const footerTextWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "flex-end",
      flexDirection: "row",
      justifyContent: "center",
      marginTop: theme.spacing.small,
      marginBottom: theme.spacing.xlarge,
    }),
    []
  );
  const cardContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing.medium,
    }),
    []
  );
  const footerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing.medium,
      marginHorizontal: theme.spacing.medium,
    }),
    []
  );
  const InfoBoxContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginVertical: theme.spacing.medium,
    }),
    []
  );

  const handleOnSharePress = () => {
    const url = "https://example.com";
    return Share.share(Platform.OS === "ios" ? { url } : { message: url });
  };

  const shareIconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.share, []);

  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnClosePress = () => {
    navigation.navigate("Referral.HubScreen");
  };

  return (
    <SafeAreaProvider>
      <Page>
        <ScrollView showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
          <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={handleOnClosePress} />} />
          <View style={container}>
            <Typography.Text weight="bold" size="large">
              {t("Referral.HowItWorksModal.title")}
            </Typography.Text>
            <Stack direction="vertical" align="stretch" gap="medium" style={cardContainerStyle}>
              <HowItWorksStepCard text={t("Referral.HowItWorksModal.stepOne")} step={1} />
              <HowItWorksStepCard text={t("Referral.HowItWorksModal.stepTwo")} step={2} />
              <HowItWorksStepCard text={t("Referral.HowItWorksModal.stepThree")} step={3} />
            </Stack>
            <View style={InfoBoxContainerStyle}>
              <InfoBox title={t("Referral.HowItWorksModal.rewardTitle") ?? ""} variant="compliment">
                {t("Referral.HowItWorksModal.rewardSubtext") ?? ""}
              </InfoBox>
            </View>
          </View>
        </ScrollView>
        <View style={footerStyle}>
          <Button
            variant="primary"
            color="alt"
            iconLeft={<ShareIcon height={shareIconDimensions} width={shareIconDimensions} />}
            onPress={handleOnSharePress}>
            <Typography.Text color="neutralBase-50" weight="semiBold" size="callout">
              {t("Referral.HowItWorksModal.buttonText")}
            </Typography.Text>
          </Button>
          <View style={footerTextWrapperStyle}>
            <Typography.Text size="caption2" color="neutralBase" weight="medium">
              {t("Referral.read")}
            </Typography.Text>
            <Pressable>
              <Typography.Text size="caption2" color="interactionBase" weight="medium">
                {t("Referral.termsAndConditions")}
              </Typography.Text>
            </Pressable>
          </View>
        </View>
      </Page>
    </SafeAreaProvider>
  );
}
