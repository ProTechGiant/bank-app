import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, TextStyle, useWindowDimensions, View, ViewStyle } from "react-native";

import { NeraNamedLogo } from "@/assets/icons";
import { Link } from "@/components";
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

import WelcomeCarouselOne from "../assets/WelcomeCarouselOne";
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

  const headerSize = height > 735 ? "brand" : "medium";

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

  const stackStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  return (
    <Page backgroundColor="neutralBase+30">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ContentContainer>
        <View>
          <Stack justify="flex-end" direction="horizontal">
            <LanguageToggle darkTheme={true} />
          </Stack>
          <View style={headerStyle}>
            <WelcomeCarouselOne height={svgHeight} width={svgWidth} />
            <View style={headerStyle}>
              <NeraNamedLogo />
            </View>
            <Typography.Header align="center" color="neutralBase-60" size={headerSize} weight="bold">
              {t("Onboarding.SplashScreen.title")}
            </Typography.Header>
          </View>
        </View>
        <Stack align="stretch" direction="vertical" gap="8p">
          <Button color="dark" variant="primary" onPress={handleOnSignUp} testID="Onboarding.SplashScreen:SignInButton">
            {t("Onboarding.SplashScreen.buttons.signUp")}
          </Button>
          <Stack direction="horizontal" style={stackStyle} justify="center" gap="4p">
            <Typography.Text color="neutralBase-40" size="footnote" weight="regular">
              {t("Onboarding.SplashScreen.buttons.notWithUs")}
            </Typography.Text>
            <Link onPress={handleOnSignIn} children={t("Onboarding.SplashScreen.buttons.signIn")} />
          </Stack>
        </Stack>
      </ContentContainer>
    </Page>
  );
}
