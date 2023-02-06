import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import { GiftIcon, InviteIcon, ReferraslIcon } from "@/assets/icons";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Typography from "@/components/Typography";
import { useGlobalContext } from "@/contexts/GlobalContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function InstructionsScreen() {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      margin: theme.spacing["20p"],
      justifyContent: "space-between",
      flex: 1,
    }),
    []
  );

  const subTextStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing["16p"],
      textAlign: "center",
    }),
    []
  );

  const iconWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
      width: 64,
      height: 64,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 32,
    }),
    []
  );
  const TitleStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing["24p"],
      textAlign: "center",
    }),
    []
  );

  const buttonContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingTop: theme.spacing["16p"],
      textAlign: "center",
    }),
    []
  );
  const iconHeight = useThemeStyles<number>(theme => theme.iconDimensions.referralInstruction.height);
  const iconWidth = useThemeStyles<number>(theme => theme.iconDimensions.referralInstruction.width);

  const { t } = useTranslation();
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const { setReferralPageViewed } = useGlobalContext();

  const totalStep = 3;

  useEffect(() => {
    setReferralPageViewed(true);
  }, []);

  const handleOnSkip = () => {
    navigation.goBack();
  };

  const handleOnContinue = () => {
    if (step < totalStep) {
      setStep(step + 1);
    } else {
      navigation.goBack();
    }
  };

  const handleBackButton = () => {
    // Navigated from first instance on referral hub but going back we want the page before this
    navigation.goBack();
    navigation.goBack();
  };

  return (
    <Page backgroundColor="primaryBase">
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}>
        <View style={container}>
          <NavHeader
            onBackPress={handleBackButton}
            color="white"
            end={
              step < totalStep && (
                <NavHeader.TextEndButton onPress={handleOnSkip} text={t(`Referral.InstructionsScreen.skip`)} />
              )
            }>
            <ProgressIndicator currentStep={step} totalStep={totalStep} />
          </NavHeader>
          <View style={styles.contentWrapper}>
            <View style={iconWrapperStyle}>
              {step === 1 ? (
                <InviteIcon width={iconWidth} height={iconHeight} />
              ) : step === 2 ? (
                <ReferraslIcon width={iconWidth} height={iconHeight} />
              ) : (
                <GiftIcon width={iconWidth} height={iconHeight} />
              )}
            </View>
            <Typography.Text color="neutralBase-50" size="large" weight="bold" style={TitleStyle}>
              {t(`Referral.InstructionsScreen.${step}.title`)}
            </Typography.Text>
            <Typography.Text color="neutralBase-20" size="callout" style={subTextStyle}>
              {t(`Referral.InstructionsScreen.${step}.subText`)}
            </Typography.Text>
          </View>
          <View style={buttonContainerStyle}>
            <Button variant="secondary" color="alt" onPress={handleOnContinue}>
              {step !== totalStep ? t("Referral.InstructionsScreen.continue") : t("Referral.InstructionsScreen.done")}
            </Button>
          </View>
        </View>
      </ScrollView>
    </Page>
  );
}
const styles = StyleSheet.create({
  contentWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
});
