import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, Platform, StatusBar, useWindowDimensions, View, ViewStyle } from "react-native";
import { BiometryTypes } from "react-native-biometrics";

import { Link } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import InfoBox from "@/components/InfoBox";
import InfoModal from "@/components/InfoModal";
import { CheckboxInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import biometricsService from "@/services/biometrics/biometricService";
import { useThemeStyles } from "@/theme";
import { BiometricStatus } from "@/types/Biometrics";

import FaceIdBiometricsImage from "../assets/icons/FaceIdBiometricsImage";
import FingerprintBiometricsImage from "../assets/icons/FingerprintBiometricsImage";
import { handleOnManageBiometrics } from "../hooks/query-hooks";

export default function BiometricSettingScreen() {
  const { height } = useWindowDimensions();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false);
  const [_isBiometricSupported, setIsBiometricSupported] = useState<boolean>(false);
  const [termsAndConditionsModal, setTermsAndConditionsModal] = useState<boolean>(false);
  const [availableBiometricType, setAvailableBiometricType] = useState<string>("");
  const [_error, setError] = useState<string>("");
  const [isBiometricEnabled, setIsBiometricEnabled] = useState<boolean>(false);

  useEffect(() => {
    biometricsService.checkBiometricSupport(setIsBiometricSupported, setAvailableBiometricType, setError);
  }, []);

  const handleSuccess = async () => {
    try {
      navigation.navigate("Ivr.IvrWaitingScreen", {
        onApiCall: async () =>
          handleOnManageBiometrics({
            ActionId: BiometricStatus.ENABLE,
            BioTypeID: availableBiometricType === BiometryTypes.TouchID ? 2 : 1,
          }),
        onBack: () => {
          biometricsService.deleteKeys();
          navigation.goBack();
        },
        onError: () => {
          biometricsService.deleteKeys();
          navigation.goBack();
        },
        onSuccess: () => navigation.navigate("Settings.CustomerAccountManagementScreen"),
        varient: "screen",
      });
    } catch (error) {
      warn("Biometric registration error", JSON.stringify(error));
    }
  };

  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        const { keysExist } = await biometricsService.biometricKeysExist();
        setIsBiometricEnabled(keysExist);
      } catch (error) {
        warn("Error checking biometrics:", JSON.stringify(error));
      }
    };

    checkBiometrics();
  }, []);

  const checkBiometricsPermissions = async () => {
    try {
      biometricsService
        .isSensorAvailable()
        .then(status => {
          if (status) {
            if (!isBiometricEnabled) {
              Alert.alert(
                t("Settings.BiometricScreen.permissionTitle"),
                t("Settings.BiometricScreen.permissionDescription"),
                [
                  {
                    text: t("Settings.BiometricScreen.donotAllow"),
                    style: "cancel",
                  },
                  {
                    text: t("Settings.BiometricScreen.allow"),
                    onPress: () => {
                      authenticateWithBiometrics();
                    },
                  },
                ],
                { cancelable: false }
              );
            }
          }
        })
        .catch(error => {
          // Handle specific error messages
          if (error.message.includes("No fingerprints enrolled")) {
            Alert.alert(
              t("Settings.BiometricScreen.setupFaceId"),
              t("Settings.BiometricScreen.goToSettings"),
              [
                {
                  text: t("Settings.BiometricScreen.cancelText"),
                  style: "cancel",
                },
                {
                  text: t("Settings.BiometricScreen.settings"),
                  onPress: () => {
                    Linking.sendIntent("android.settings.SETTINGS");
                  },
                },
              ],
              { cancelable: false }
            );
          } else {
            // Handle other biometrics errors
            Alert.alert("Biometrics Error", `Biometrics failed with error: ${error.message}`);
          }
        });
    } catch (e) {}
  };

  const authenticateWithBiometrics = async () => {
    try {
      const result = await biometricsService.initiate({
        promptMessage: t("Settings.BiometricScreen.confirmBiometrics"),
        cancelButtonText: t("Settings.BiometricScreen.cancelText"),
        requestFrom: Platform.OS,
      });
      if (result !== "User cancellation") handleSuccess();
    } catch (error) {
      warn("biometrics", `biometrics failed ${error}`);

      Alert.alert(
        t("Settings.BiometricScreen.setupFaceId"),
        t("Settings.BiometricScreen.goToSettings"),
        [
          {
            text: t("Settings.BiometricScreen.cancelText"),
            style: "cancel",
          },
          {
            text: t("Settings.BiometricScreen.settings"),
            onPress: () => Linking.sendIntent("android.settings.SETTINGS"),
          },
        ],
        { cancelable: false }
      );
    }
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

  const whiteColor = useThemeStyles<string>(theme => theme.palette.transparent);
  return (
    <Page>
      <NavHeader withBackButton={true} />
      <StatusBar barStyle="dark-content" backgroundColor={whiteColor} />
      <ContentContainer>
        <Stack direction="vertical" flex={1} justify="flex-start" gap="24p" align="stretch">
          <View style={headerViewStyle}>{isFaceId ? <FaceIdBiometricsImage /> : <FingerprintBiometricsImage />}</View>
          <Stack direction="vertical" gap="8p" align="center" justify="center" style={messageContainerStyle}>
            <Typography.Text size="title1" weight="bold">
              {isFaceId ? t("Settings.BiometricScreen.faceIdtitle") : t("Settings.BiometricScreen.fingerPrintTitle")}
            </Typography.Text>
            <Typography.Text align="center" size="callout" weight="regular" color="neutralBase+10">
              {isFaceId
                ? t("Settings.BiometricScreen.faceIdSubTitle")
                : t("SignIn.BiometricScreen.fingerPrintSubTitle")}
            </Typography.Text>
          </Stack>
          <Stack direction="horizontal">
            <InfoBox
              variant="success"
              borderPosition="start"
              title={
                isFaceId
                  ? t("Settings.BiometricScreen.faceIdHelpLabel")
                  : t("Settings.BiometricScreen.fingerPrintHelpLabel")
              }
            />
          </Stack>
        </Stack>
        <Stack direction="vertical" gap="24p" align="stretch">
          <Stack direction="horizontal" gap="8p" align="flex-start">
            <CheckboxInput
              onChange={() => setIsTermsChecked(!isTermsChecked)}
              value={isTermsChecked}
              isEditable={true}
            />
            <Stack direction="horizontal">
              <Stack direction="horizontal">
                <Typography.Text size="footnote" weight="regular" color="neutralBase">
                  {t("Settings.BiometricScreen.TermsAndConditions.agreeTo")}
                </Typography.Text>
                <Link
                  children={t("Settings.BiometricScreen.TermsAndConditions.termsAndCondition")}
                  onPress={() => setTermsAndConditionsModal(true)}
                />
              </Stack>
            </Stack>
          </Stack>
          <Stack direction="vertical" gap="8p" align="stretch">
            <Button disabled={!isTermsChecked} onPress={checkBiometricsPermissions}>
              {isFaceId ? t("Settings.BiometricScreen.turnOnFaceId") : t("Settings.BiometricScreen.turnOnTouchId")}
            </Button>
          </Stack>
        </Stack>
      </ContentContainer>
      <InfoModal
        isVisible={termsAndConditionsModal}
        variant="Biometric"
        onClose={() => setTermsAndConditionsModal(false)}
        title={t("Settings.BiometricScreen.TermsAndConditions.InfoModal.title")}
        description={t("Settings.BiometricScreen.TermsAndConditions.InfoModal.description")}
      />
    </Page>
  );
}
