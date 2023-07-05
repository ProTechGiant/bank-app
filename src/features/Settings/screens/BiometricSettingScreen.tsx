import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWindowDimensions, View, ViewStyle } from "react-native";
import { BiometryTypes } from "react-native-biometrics";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useAuthContext } from "@/contexts/AuthContext";
import { warn } from "@/logger";
import biometricsService from "@/services/BiometricService";
import { useThemeStyles } from "@/theme";

import FaceIdBiometricsImage from "../assets/icons/FaceIdBiometricsImage";
import FingerprintBiometricsImage from "../assets/icons/FingerprintBiometricsImage";

export default function BiometricSettingScreen() {
  const { height } = useWindowDimensions();
  const { t } = useTranslation();
  const auth = useAuthContext();
  const [, setIsBiometricSupported] = useState<boolean>(false);
  const [availableBiometricType, setAvailableBiometricType] = useState<string>("");
  const [_error, setError] = useState<string>("");

  useEffect(() => {
    biometricsService.checkBiometricSupport(setIsBiometricSupported, setAvailableBiometricType, setError);
  }, []);

  const navigateToHome = () => {
    auth.authenticate(auth.userId ?? "");
  };

  const authenticateWithBiometrics = async () => {
    biometricsService
      .simplePrompt({ promptMessage: t("SignIn.BiometricScreen.confirmBiometrics") })
      .then(resultObject => {
        const { success } = resultObject;
        if (success) {
          navigateToHome();
        } else {
          warn("biometrics", `user cancelled biometric prompt}`);
        }
      })
      .catch(error => {
        warn("biometrics", `biometrics failed ${error}`);
      });
  };

  const isFaceId = availableBiometricType === BiometryTypes.FaceID;

  const headerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    rowGap: theme.spacing["24p"],
    marginTop:
      height / 5 - // calculation to get 20% of screen height
      theme.spacing["20p"] - // remove ContentContainer Padding
      52, // remove NavHeader height
    marginBottom: theme.spacing["24p"],
    width: "100%",
  }));

  const messageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <Page>
      <NavHeader withBackButton={true} />
      <ContentContainer>
        <Stack direction="vertical" flex={1} justify="flex-start" gap="24p" align="stretch">
          <View style={headerViewStyle}>
            {isFaceId ? <FaceIdBiometricsImage /> : <FingerprintBiometricsImage />}
            <Stack direction="vertical" gap="8p" align="center" justify="center" style={messageContainerStyle}>
              <Typography.Text size="title1" weight="bold">
                {isFaceId ? t("SignIn.BiometricScreen.faceIdtitle") : t("SignIn.BiometricScreen.fingerPrintTitle")}
              </Typography.Text>
              <Typography.Text align="center" size="callout" weight="regular" color="neutralBase+10">
                {isFaceId
                  ? t("SignIn.BiometricScreen.faceIdSubTitle")
                  : t("SignIn.BiometricScreen.fingerPrintSubTitle")}
              </Typography.Text>
            </Stack>
          </View>
        </Stack>
        <Stack direction="vertical" gap="24p" align="stretch">
          <View style={messageContainerStyle}>
            <Typography.Text size="footnote" weight="regular" align="center" color="neutralBase">
              {isFaceId
                ? t("SignIn.BiometricScreen.faceIdHelpLabel")
                : t("SignIn.BiometricScreen.fingerPrintHelpLabel")}
            </Typography.Text>
          </View>
          <Stack direction="vertical" gap="8p" align="stretch">
            <Button onPress={authenticateWithBiometrics}>
              {isFaceId ? t("SignIn.BiometricScreen.turnOnFaceId") : t("SignIn.BiometricScreen.turnOnTouchId")}
            </Button>
            <Button onPress={navigateToHome} variant="tertiary">
              {t("SignIn.BiometricScreen.later")}
            </Button>
          </Stack>
        </Stack>
      </ContentContainer>
    </Page>
  );
}
