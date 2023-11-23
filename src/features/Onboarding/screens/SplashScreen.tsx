import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, TextStyle, useWindowDimensions, View } from "react-native";

import { NeraNamedLogo } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useAuthContext } from "@/contexts/AuthContext";
import { useGetAuthenticationToken } from "@/hooks/use-api-authentication-token";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";
import { setItemInEncryptedStorage } from "@/utils/encrypted-storage";

import SplashScreenRocket from "../assets/SplashScreenRocket";
import { LanguageToggle } from "../components";
import { useOnboardingContext } from "../contexts/OnboardingContext";

export default function SplashScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { setCorrelationId } = useOnboardingContext();
  const { height } = useWindowDimensions();
  const auth = useAuthContext();
  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken();

  const svgHeight = height * 0.5; // Adjust the height as needed
  const svgWidth = svgHeight * 0.75; // Adjust the aspect ratio as needed

  const headerSize = height > 735 ? "large" : "medium";

  useEffect(() => {
    async function checkAuthToken() {
      try {
        handleGetAuthenticationToken();
      } catch (error) {
        warn("authentication api error: ", JSON.stringify(error));
      }
    }

    checkAuthToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const handleGetAuthenticationToken = async () => {
    const res = await getAuthenticationToken();
    if (typeof res?.AccessToken === "string") {
      setItemInEncryptedStorage("authToken", res.AccessToken);
      auth.setAuthToken(res.AccessToken);
    }
  };

  const handleOnSignIn = async () => {
    navigation.navigate("SignIn.SignInStack", { screen: "SignIn.Iqama" });
  };

  const handleOnSignUp = () => {
    const _correlationId = generateRandomId();
    setCorrelationId(_correlationId);
    navigation.navigate("Onboarding.Iqama");
  };

  const headerStyle = useThemeStyles<TextStyle>(theme => ({
    alignItems: "center",
    paddingBottom: theme.spacing["24p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ContentContainer>
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
          <Button variant="primary" onPress={handleOnSignIn} testID="Onboarding.SplashScreen:SignInButton">
            {t("Onboarding.SplashScreen.buttons.signIn")}
          </Button>
          <Button onPress={handleOnSignUp} variant="tertiary" testID="Onboarding.SplashScreen:SignUpButton">
            {t("Onboarding.SplashScreen.buttons.notWithUs")}{" "}
            <Typography.Text style={styles.signIn} weight="medium" color="primaryBase-30">
              {t("Onboarding.SplashScreen.buttons.signUp")}
            </Typography.Text>
          </Button>
        </Stack>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  signIn: {
    textDecorationLine: "underline",
  },
});
