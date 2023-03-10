import { useTranslation } from "react-i18next";
import { Alert, StatusBar, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import DarkOneGradient from "@/components/LinearGradients/GradientBackgrounds";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";

import { useOnboardingContext } from "../../context/OnboardingContext";
import LanguageToggle from "./LanguageToggle";

export default function OnboardingSplashScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setCorrelationId } = useOnboardingContext();

  const contentViewStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["16p"],
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between",
  }));

  const handleOnSignIn = () => {
    Alert.alert("Sign-in process not implemented yet. Come back later!");
  };

  const handleOnSignUp = () => {
    const _correlationId = generateRandomId();
    setCorrelationId(_correlationId);
    navigation.navigate("Onboarding.Iqama");
  };

  return (
    <DarkOneGradient>
      <Page>
        <StatusBar barStyle="light-content" />
        <Stack justify="flex-end" direction="horizontal">
          <LanguageToggle />
        </Stack>
        <View style={contentViewStyle}>
          <View>
            <Stack direction="vertical" align="center" style={{ marginTop: "50%" }}>
              <Typography.Text size="large" weight="bold" color="neutralBase-50">
                {t("Onboarding.SplashScreen.title")}
              </Typography.Text>
            </Stack>
            <View>
              <Typography.Text size="footnote" weight="regular" color="neutralBase-50" align="center">
                {t("Onboarding.SplashScreen.subTitle")}
              </Typography.Text>
            </View>
          </View>
          <Stack align="stretch" direction="vertical" gap="8p">
            <Button variant="primary" color="dark" onPress={handleOnSignUp}>
              {t("Onboarding.SplashScreen.buttons.signUp")}
            </Button>
            <Button color="dark" onPress={handleOnSignIn} variant="secondary">
              {t("Onboarding.SplashScreen.buttons.signIn")}
            </Button>
          </Stack>
        </View>
      </Page>
    </DarkOneGradient>
  );
}
