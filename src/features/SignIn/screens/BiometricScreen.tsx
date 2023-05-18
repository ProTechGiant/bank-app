import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { BiometryTypes } from "react-native-biometrics";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { useAuthContext } from "@/contexts/AuthContext";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import biometricsService from "@/services/BiometricService";
import { useThemeStyles } from "@/theme";

import FaceId from "../assets/face-id.svg";
import FingerPrint from "../assets/finger-print.svg";

export default function BiometricScreen() {
  const { t } = useTranslation();
  const auth = useAuthContext();
  const navigation = useNavigation();
  const [, setIsBiometricSupported] = useState<boolean>(false);
  const [availableBiometricType, setAvailableBiometricType] = useState<string>("");
  const [_error, setError] = useState<string>("");

  useEffect(() => {
    biometricsService.checkBiometricSupport(setIsBiometricSupported, setAvailableBiometricType, setError);
  }, []);

  const navigateToHome = () => {
    auth.authenticate(auth.userId ?? "");
    navigation.navigate("Home.HomeStack", { screen: "Home.DashboardScreen" });
  };

  const authenticateWithBiometrics = async () => {
    biometricsService
      .simplePrompt({ promptMessage: t("SignIn.BiometricScreen.confirmBiometrics") })
      .then(resultObject => {
        const { success } = resultObject;
        if (success) {
          auth.authenticate(auth.userId ?? "");
          navigation.navigate("Home.HomeStack", { screen: "Home.DashboardScreen" });
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
    marginBottom: theme.spacing["24p"],
    alignItems: "center",
  }));

  const headerTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["16p"],
  }));

  const footNoteViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const accountSignInStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "center",
    flexDirection: "row",
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["32p"],
  }));

  const submitButtonView = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));

  const badgeContainer = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.xxlarge,
    backgroundColor: theme.palette["neutralBase-30"],
    marginBottom: theme.spacing["64p"],
    paddingVertical: theme.spacing["12p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <Page>
      <NavHeader withBackButton={true} />
      <ContentContainer isScrollView style={styles.containerStyle}>
        <View style={headerViewStyle}>
          <View style={badgeContainer}>
            <Typography.Text color="primaryBase">{t("SignIn.BiometricScreen.brandText")}</Typography.Text>
          </View>
          {isFaceId ? <FaceId /> : <FingerPrint />}
          <Typography.Text size="title1" weight="bold" style={headerTitleStyle}>
            {isFaceId ? t("SignIn.BiometricScreen.faceIdtitle") : t("SignIn.BiometricScreen.fingerPrintTitle")}
          </Typography.Text>
          <Typography.Text align="center" size="callout" weight="regular">
            {isFaceId ? t("SignIn.BiometricScreen.faceIdSubTitle") : t("SignIn.BiometricScreen.fingerPrintSubTitle")}
          </Typography.Text>
        </View>
      </ContentContainer>
      <View style={submitButtonView}>
        <Typography.Text size="footnote" weight="regular" align="center" style={footNoteViewStyle}>
          {isFaceId ? t("SignIn.BiometricScreen.faceIdHelpLabel") : t("SignIn.BiometricScreen.fingerPrintHelpLabel")}
        </Typography.Text>
        <Button onPress={authenticateWithBiometrics}>
          {isFaceId ? t("SignIn.BiometricScreen.turnOnFaceId") : t("SignIn.BiometricScreen.turnOnTouchId")}
        </Button>
        <View style={accountSignInStyle}>
          <Pressable onPress={navigateToHome}>
            <Typography.Text align="center" size="body" weight="regular" color="primaryBase">
              {t("SignIn.BiometricScreen.later")}
            </Typography.Text>
          </Pressable>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: "center",
  },
});
