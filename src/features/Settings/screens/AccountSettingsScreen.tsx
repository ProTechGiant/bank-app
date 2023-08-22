import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { WithShadow } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import { useAuthContext } from "@/contexts/AuthContext";
import useLogout from "@/hooks/use-logout";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import biometricsService from "@/services/biometrics/biometricService";
import { useThemeStyles } from "@/theme";

export default function AccountSettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const auth = useAuthContext();
  const signoutUser = useLogout();
  const [toggleStatus, setToggleStatus] = useState<boolean>(false);

  const [isBiometricSupported, setIsBiometricSupported] = useState<boolean>(false);
  const [_availableBiometricType, setAvailableBiometricType] = useState<string>("");
  const [_error, setError] = useState<string>("");

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (toggleStatus) {
      authenticateWithBiometrics(isBiometricSupported);
    }
  }, [toggleStatus, isBiometricSupported]);

  useEffect(() => {
    biometricsService.checkBiometricSupport(setIsBiometricSupported, setAvailableBiometricType, setError);
  }, []);

  const handleSignOut = async () => {
    try {
      await signoutUser.mutateAsync();
      auth.logout();
    } catch (error) {
      const typedError = error as Error;
      warn("logout-api error: ", typedError.message);
    }
  };

  const handleChangePasscode = () => {
    navigation.navigate("Passcode.ChangePasscodeStack");
  };

  const authenticateWithBiometrics = async (isEnabled: boolean) => {
    const isBiometric = await biometricsService.biometricKeysExist();
    if (!isEnabled && isBiometricSupported && isBiometric) {
      await biometricsService.deleteKeys();
    } else if (isEnabled && isBiometricSupported) {
      biometricsService
        .simplePrompt({ promptMessage: t("SignIn.BiometricScreen.confirmBiometrics") })
        .then(resultObject => {
          const { success } = resultObject;
          if (success) {
            setToggleStatus(!toggleStatus);
          } else {
            warn("biometrics", `user cancelled biometric prompt}`);
          }
        })
        .catch(() => {
          warn("biometrics", `biometrics failed}`);
        });
    }
  };

  const headerTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["16p"],
  }));

  const titleContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing["16p"],
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const footerText = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const chevronRightIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  return (
    <Page>
      <NavHeader withBackButton={true} />
      <ContentContainer isScrollView>
        <View style={containerStyle}>
          <Typography.Text size="title1" weight="bold" style={headerTitleStyle}>
            {t("Settings.AccountSettings.title")}
          </Typography.Text>
          <Typography.Text size="callout" weight="regular">
            {t("Settings.AccountSettings.subTitle")}
          </Typography.Text>
        </View>
        <WithShadow backgroundColor="neutralBase-50" borderRadius="extraSmall">
          <Pressable style={titleContainerStyles} onPress={handleChangePasscode}>
            <Typography.Text color="primaryBase" size="callout" weight="semiBold">
              {t("Settings.AccountSettings.changePasscode")}
            </Typography.Text>
            <ChevronRightIcon color={chevronRightIconColor} />
          </Pressable>
          <Pressable style={titleContainerStyles}>
            <Typography.Text color="primaryBase" size="callout" weight="semiBold">
              {t("Settings.AccountSettings.turnBiometricsOn")}
            </Typography.Text>
            <Toggle onPress={() => setToggleStatus(!toggleStatus)} value={toggleStatus} />
          </Pressable>
        </WithShadow>
      </ContentContainer>
      <Pressable style={footerText} onPress={() => setIsModalVisible(true)}>
        <Typography.Text align="center" color="errorBase" size="body" weight="semiBold">
          {t("Settings.AccountSettings.signOut")}
        </Typography.Text>
      </Pressable>
      <NotificationModal
        variant="warning"
        title={t("Settings.AccountSettings.youSure")}
        message={t("Settings.AccountSettings.message")}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        buttons={{
          primary: <Button onPress={handleSignOut}>{t("Settings.AccountSettings.button")}</Button>,
          secondary: (
            <Button onPress={() => setIsModalVisible(false)}>{t("Settings.AccountSettings.cancelButton")}</Button>
          ),
        }}
      />
    </Page>
  );
}
