import { useTranslation } from "react-i18next";
import { Alert, Pressable, SafeAreaView, StatusBar, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import { Inline } from "@/components/Inline";
import DarkOneGradient from "@/components/LinearGradients/GradientBackgrounds";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { vh } from "@/theme/viewportUnit";

import LanguageToggle from "./LanguageToggle";

const OnboardingSplashScreen = () => {
  const { t, i18n } = useTranslation();

  const bodyStyle = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette["neutralBase-50"],
      fontSize: theme.typography.text.sizes.footnote,
      fontWeight: theme.typography.text.weights.regular,
      lineHeight: theme.typography.text._lineHeights.footnote,
      textAlign: "center",
    }),
    []
  );
  const buttonGroupStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginHorizontal: theme.spacing.regular,
      marginTop: "auto",
    }),
    []
  );
  const contentViewStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing.regular,
    }),
    []
  );
  const headerViewStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      marginBottom: theme.spacing.xlarge,
      marginTop: 18 * vh,
    }),
    []
  );

  const signInContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      borderColor: theme.palette["neutralBase-50"],
      borderRadius: theme.radii.extraSmall,
      borderWidth: 1,
      height: 54,
      justifyContent: "center",
      marginTop: theme.spacing.small,
    }),
    []
  );

  const navigation = useNavigation();

  const ButtonPressed = () => {
    Alert.alert("signin button pressed");
  };

  const handleOnContinueOnboarding = () => {
    navigation.navigate("Onboarding.Iqama");
  };

  return (
    <DarkOneGradient>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Inline xAlign={i18n.dir() === "ltr" ? "flex-end" : "flex-start"}>
          <LanguageToggle />
        </Inline>
        <View style={contentViewStyle}>
          <View style={headerViewStyle}>
            <Typography.Text size="large" weight="bold" color="neutralBase-50">
              {t("Onboarding.SplashScreen.title")}
            </Typography.Text>
          </View>
          <View>
            <Typography.Text size="footnote" weight="regular" color="neutralBase-50" style={bodyStyle}>
              {t("Onboarding.SplashScreen.subTitle")}
            </Typography.Text>
          </View>
        </View>
        <View style={buttonGroupStyle}>
          <Button variant="primary" color="alt" onPress={handleOnContinueOnboarding}>
            {t("Onboarding.SplashScreen.buttons.signUp")}
          </Button>

          <Pressable onPress={ButtonPressed} style={signInContainerStyle}>
            <Typography.Text color="neutralBase-50" size="body" weight="regular">
              {t("Onboarding.SplashScreen.buttons.signIn")}
            </Typography.Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </DarkOneGradient>
  );
};

export default OnboardingSplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
