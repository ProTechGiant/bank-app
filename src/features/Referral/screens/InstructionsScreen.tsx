import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Typography from "@/components/Typography";
import { useGlobalContext } from "@/contexts/GlobalContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function InstructionsScreen() {
  const { width } = useWindowDimensions();

  const blankSpaceStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["primaryBase-30"],
      height: width - theme.spacing.regular - theme.spacing.regular,
      justifyContent: "center",
      alignItems: "center",
    }),
    [width]
  );

  const container = useThemeStyles<ViewStyle>(
    theme => ({
      margin: theme.spacing.regular,
      justifyContent: "space-between",
      textAlign: "center",
      flex: 1,
    }),
    []
  );

  const subTextStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing.medium,
      textAlign: "center",
    }),
    []
  );
  const TitleStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginTop: theme.spacing.large,
      textAlign: "center",
    }),
    []
  );

  const buttonContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingTop: theme.spacing.medium,
      textAlign: "center",
    }),
    []
  );
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
        <NavHeader
          onBackPress={handleBackButton}
          color="white"
          end={
            step < totalStep && (
              <NavHeader.TextEndButton onPress={handleOnSkip} text={t(`Referral.InstructionsScreen.skip`)} />
            )
          }
        />
        <ProgressIndicator currentStep={step} totalStep={totalStep} />
        <View style={container}>
          <View>
            <View style={blankSpaceStyle}>
              <Typography.Text>HERO BRAND SCREEN</Typography.Text>
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
              {t("Referral.InstructionsScreen.continue")}
            </Button>
          </View>
        </View>
      </ScrollView>
    </Page>
  );
}
const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
});
