import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, TextStyle, useWindowDimensions, View, ViewStyle } from "react-native";

import { NeraNamedLogo } from "@/assets/icons";
import Button from "@/components/Button";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";
import { hasItemInStorage } from "@/utils/encrypted-storage";

import SplashScreenRocket from "../assets/SplashScreenRocket";
import { LanguageToggle } from "../components";
import { useOnboardingContext } from "../contexts/OnboardingContext";

export default function SplashScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { setCorrelationId } = useOnboardingContext();
  const { height } = useWindowDimensions();

  const svgHeight = height * 0.5; // Adjust the height as needed
  const svgWidth = svgHeight * 0.75; // Adjust the aspect ratio as needed

  const headerSize = height > 735 ? "large" : "medium";

  const handleOnSignIn = async () => {
    const screenName = (await hasItemInStorage("user")) ? "SignIn.Passcode" : "SignIn.Iqama";
    navigation.navigate("SignIn.SignInStack", { screen: screenName });
  };

  const handleOnSignUp = () => {
    const _correlationId = generateRandomId();
    setCorrelationId(_correlationId);
    navigation.navigate("Onboarding.Iqama");
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    flex: 1,
    justifyContent: "space-between",
  }));

  const headerStyle = useThemeStyles<TextStyle>(theme => ({
    alignItems: "center",
    paddingBottom: theme.spacing["24p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={contentStyle}>
        <View>
          <Stack justify="flex-end" direction="horizontal">
            <LanguageToggle />
          </Stack>
          <View style={headerStyle}>
            <SplashScreenRocket width={svgWidth} height={svgHeight} />
            <View style={headerStyle}>
              <NeraNamedLogo />
            </View>
            <Typography.Header align="center" color="neutralBase+30" size={headerSize} weight="bold">
              {t("Onboarding.SplashScreen.title")}
            </Typography.Header>
          </View>
        </View>
        <Stack align="stretch" direction="vertical" gap="8p">
          <Button variant="primary" onPress={handleOnSignIn}>
            {t("Onboarding.SplashScreen.buttons.signIn")}
          </Button>
          <Button onPress={handleOnSignUp} variant="tertiary">
            {t("Onboarding.SplashScreen.buttons.notWithUs")}{" "}
            <Typography.Text style={styles.signIn} weight="medium" color="primaryBase-30">
              {t("Onboarding.SplashScreen.buttons.signUp")}
            </Typography.Text>
          </Button>
        </Stack>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  signIn: {
    textDecorationLine: "underline",
  },
});
