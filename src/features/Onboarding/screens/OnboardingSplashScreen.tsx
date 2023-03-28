import { useTranslation } from "react-i18next";
import { Alert, StatusBar, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";

import BackgroundImageSvg from "../assets/background-image.svg";
import { LanguageToggle } from "../components";
import { useOnboardingContext } from "../contexts/OnboardingContext";

export default function OnboardingSplashScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setCorrelationId } = useOnboardingContext();

  const handleOnSignIn = () => {
    Alert.alert("Sign-in process not implemented yet. Come back later!");
  };

  const handleOnSignUp = () => {
    const _correlationId = generateRandomId();
    setCorrelationId(_correlationId);
    navigation.navigate("Onboarding.Iqama");
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["20p"],
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
      <View style={StyleSheet.absoluteFill}>
        <BackgroundImageSvg />
      </View>
      <View style={contentStyle}>
        <Stack justify="flex-end" direction="horizontal">
          <LanguageToggle />
        </Stack>
        <View style={headerStyle}>
          <Typography.Text align="center" color="neutralBase+30" size="large" weight="bold">
            {t("Onboarding.SplashScreen.title")}
          </Typography.Text>
        </View>
        <Stack align="stretch" direction="vertical" gap="8p">
          <Button variant="primary" onPress={handleOnSignUp}>
            {t("Onboarding.SplashScreen.buttons.signUp")}
          </Button>
          <Button onPress={handleOnSignIn} variant="tertiary">
            {t("Onboarding.SplashScreen.buttons.signIn")}
          </Button>
        </Stack>
      </View>
    </Page>
  );
}
