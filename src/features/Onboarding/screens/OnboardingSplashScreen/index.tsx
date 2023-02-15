import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StatusBar, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import DarkOneGradient from "@/components/LinearGradients/GradientBackgrounds";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useOnboardingContext } from "../../context/OnboardingContext";
import LanguageToggle from "./LanguageToggle";

export default function OnboardingSplashScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { startOnboardingAsync } = useOnboardingContext();
  const [loading, setLoading] = useState<"loader" | undefined>(undefined);

  const contentViewStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between",
  }));

  const handleOnSignIn = () => {
    Alert.alert("Sign-in process not implemented yet. Come back later!");
  };

  const handleOnSignUp = () => {
    const _retryableStart = async () => {
      setLoading("loader");
      await startOnboardingAsync();
      setLoading(undefined);
      navigation.navigate("Onboarding.Iqama");
    };

    const _woopsFailed = (_error: unknown) => {
      Alert.alert("Woops! Something went wrong :<");
      __DEV__ && console.error("Could not start onboarding flow:", _error);
    };

    _retryableStart()
      .catch(() => _retryableStart())
      .catch(error => _woopsFailed(error));
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
            <View style={{ alignItems: "center", marginTop: "50%" }}>
              <Typography.Text size="large" weight="bold" color="neutralBase-50">
                {t("Onboarding.SplashScreen.title")}
              </Typography.Text>
            </View>
            <View>
              <Typography.Text size="footnote" weight="regular" color="neutralBase-50" align="center">
                {t("Onboarding.SplashScreen.subTitle")}
              </Typography.Text>
            </View>
          </View>
          <Stack align="stretch" direction="vertical" gap="8p">
            <Button type={loading} variant="primary" color="alt" onPress={handleOnSignUp}>
              {t("Onboarding.SplashScreen.buttons.signUp")}
            </Button>
            <Button color="base" onPress={handleOnSignIn} variant="secondary">
              <Typography.Text color="neutralBase-50" size="body" weight="regular">
                {t("Onboarding.SplashScreen.buttons.signIn")}
              </Typography.Text>
            </Button>
          </Stack>
        </View>
      </Page>
    </DarkOneGradient>
  );
}
