import { useIsFocused } from "@react-navigation/native";
import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Switch, View, ViewStyle } from "react-native";
import { BiometryTypes } from "react-native-biometrics";

import { FinancialInformationIcon, LifestyleIcon, TodosIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import CustomStatusBar from "@/components/CustomStatusBar/CustomStatusBar";
import Divider from "@/components/Divider";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import SignOutModal from "@/components/SignOutModal";
import Typography from "@/components/Typography";
import { deviceStatusEnum } from "@/features/SignIn/constants";
import { useSignInContext } from "@/features/SignIn/contexts/SignInContext";
import { usePanicMode } from "@/features/SignIn/hooks/query-hooks";
import { useGetAuthenticationToken } from "@/hooks/use-api-authentication-token";
import { logoutActionsIds, useLogout } from "@/hooks/use-logout";
import { UserType } from "@/hooks/use-search-user-by-national-id";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import biometricsService from "@/services/biometrics/biometricService";
import { useTheme, useThemeStyles } from "@/theme";
import { BiometricStatus } from "@/types/Biometrics";
import { getAppVerionDetails, getUniqueDeviceId } from "@/utils";
import delayTransition from "@/utils/delay-transition";
import { getItemFromEncryptedStorage } from "@/utils/encrypted-storage";

import {
  AliasManagmentIcon,
  BiometricAuthenticationIcon,
  ConnectedServicesIcon,
  InviteFriendIcon,
  LanguageIcon,
  MyCasesIcon,
  NotificationsIcon,
  PasscodeIcon,
  ProfileDetailsIcon,
  SignOutIcon,
} from "../assets/icons";
import PanicModeIcon from "../assets/icons/PanicModeIcon";
import {
  EditHomeConfiguration,
  SettingLanguagesSection,
  SettingsCategoryContainer,
  SettingSection,
} from "../components";
import { useCheckDailyPasscodeLimit, useManageBiometrics } from "../hooks/query-hooks";

export default function CustomerAccountManagement() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { refetch: checkDailyPasscodeLimit } = useCheckDailyPasscodeLimit();
  const { mutateAsync: editPanicMode } = usePanicMode();
  const signOutUser = useLogout();
  const { userData } = useSignInContext();
  const { mutateAsync: getAuthenticationToken } = useGetAuthenticationToken();
  const { theme } = useTheme();
  const isFocused = useIsFocused();
  const { mutateAsync: ManageBiometrics } = useManageBiometrics();
  const [_isBiometricSupported, setIsBiometricSupported] = useState<boolean>(false);
  const [availableBiometricType, setAvailableBiometricType] = useState<string>("");
  const [isBiometricEnabled, setIsBiometricEnabled] = useState<boolean>(false);
  const [isSignOutModalVisible, setIsSignOutModalVisible] = useState(false);
  const [isEditHomeConfigurationVisible, setIsEditHomeConfigurationVisible] = useState(false);
  const [hasReachedPasscodeUpdateLimit, setHasReachedPasscodeUpdateLimit] = useState(false);
  const [isLogoutFailedModalVisible, setIsLogoutFailedModalVisible] = useState<boolean>(false);
  const [isActivePanicModeModal, setIsActivePanicModeModal] = useState<boolean>(false);
  const [showDisableBiometricsModal, setShowDisableBiometricsModal] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(userData);
  const [isSubmitPanicErrorVisible, setIsSubmitPanicErrorVisible] = useState<boolean>(false);
  const [deviceStatus, setDeviceStatus] = useState<string>("");
  const isRegisteredDevice = deviceStatus === deviceStatusEnum.REGISTERED;

  useEffect(() => {
    const checkDeviceRegistration = async () => {
      const deviceId = await getUniqueDeviceId();
      try {
        if (!user) return;
        if (user.DeviceId === deviceId && user.DeviceStatus === "R") {
          setDeviceStatus(deviceStatusEnum.REGISTERED);
        } else if (user.DeviceId !== deviceId) {
          setDeviceStatus(deviceStatusEnum.NEW);
        }
      } catch (error) {
        warn("Error checking device registration:", JSON.stringify(error));
      }
    };

    checkDeviceRegistration();
  }, [user]);

  useEffect(() => {
    (async () => {
      const userDataInStorage = await getItemFromEncryptedStorage("user");
      if (userDataInStorage) {
        setUser(JSON.parse(userDataInStorage));
      }
    })();
  }, [isFocused]);

  useEffect(() => {
    biometricsService.checkBiometricSupport(setIsBiometricSupported, setAvailableBiometricType);
  }, []);

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
  }, [isFocused]);

  const handleOnBackPress = () => {
    navigation.goBack();
  };
  // this function will be changed when integrate screens with this stack
  const handleNotificationPress = () => {
    navigation.navigate("NotificationManagement.NotificationManagementStack");
  };

  const handleOnPassCodePress = async () => {
    const { data } = await checkDailyPasscodeLimit();
    if (data?.UpdatePasscodeEnabled) {
      navigation.navigate("Passcode.ChangePasscodeStack");
    } else {
      setHasReachedPasscodeUpdateLimit(true);
    }
  };

  const handleMyCasesPress = () => {
    navigation.navigate("PaymentDisputes.PaymentDisputesStack", {
      screen: "PaymentDisputes.MyCasesLandingScreen",
    });
  };

  const handleInviteFriendPress = () => {
    navigation.navigate("Referral.ReferralStack", { screen: "Referral.HubScreen" });
  };

  const handleBiometricPress = () => {
    if (!isRegisteredDevice) return;
    if (isBiometricEnabled) {
      setShowDisableBiometricsModal(true);
    } else {
      navigation.navigate("Settings.BiometricScreen");
    }
  };

  const handleSignOutPress = () => {
    setIsSignOutModalVisible(true);
  };

  const handleEditHomePress = () => {
    setIsEditHomeConfigurationVisible(true);
  };

  const handleOnLifeStylePress = () => {
    navigation.navigate("Settings.LifeStyleScreen");
  };

  const handleOnFinancialInformationPress = () => {
    navigation.navigate("Settings.FinancialInformationScreen");
  };

  const handleOnTodosPress = () => {
    navigation.navigate("Settings.TodosScreen");
  };

  const handleAliasManagmentPress = () => {
    navigation.navigate("ProxyAlias.ProxyAliasStack", { screen: "ProxyAlias.AliasManagementScreen" });
  };

  const handleOnActivePanicModeModal = () => {
    setIsActivePanicModeModal(true);
  };

  const handleOnActivePanicMode = async () => {
    const authentication = await getAuthenticationToken();

    try {
      await editPanicMode({
        isPanic: true,
        nationalId: user.NationalId,
        mobileNumber: user.MobileNumber,
        token: authentication.AccessToken,
      });
      setIsActivePanicModeModal(false);

      await signOutUser.mutateAsync({ ActionId: logoutActionsIds.SIGNOUT_ONLY, token: authentication.AccessToken });
    } catch (error) {
      setIsActivePanicModeModal(false);
      setIsSubmitPanicErrorVisible(true);
    }
  };

  const handleConnectedServicesPress = () => {
    try {
      navigation.navigate("Settings.ConnectedServicesScreen");
    } catch (error) {
      setIsLogoutFailedModalVisible(true);
      warn("connected-services", "Could not navigate to connected services", JSON.stringify(error));
    }
  };

  const handleOnDeviceManagementClick = () => {
    try {
      navigation.navigate("Settings.DeviceManagementScreen");
    } catch (error) {
      setIsLogoutFailedModalVisible(true);
      warn("device-management", "Could not navigate to connected services", JSON.stringify(error));
    }
  };

  const handleDisableBiometrics = async () => {
    try {
      await ManageBiometrics({
        ActionId: BiometricStatus.DISABLE,
        BioTypeID: availableBiometricType === BiometryTypes.TouchID ? 2 : 1,
      });
      biometricsService.deleteKeys();
      setIsBiometricEnabled(false);
      setShowDisableBiometricsModal(false);
    } catch (error) {
      warn("Error deleting Biometrics", JSON.stringify(error));
    }
  };

  const handleOnClose = () => {
    setIsSignOutModalVisible(false);
  };

  const handleOnCloseError = () => {
    setIsSignOutModalVisible(false);
    delayTransition(() => {
      setIsLogoutFailedModalVisible(true);
    });
  };

  const handleOnCloseEditHomeConfiguration = () => {
    setIsEditHomeConfigurationVisible(false);
  };

  const handleReachedPasscodeUpdateLimit = () => {
    setHasReachedPasscodeUpdateLimit(false);
  };
  const handleOnProfileDetailsPress = () => {
    navigation.navigate("ProfileDetails.ProfileDetailsStack");
  };

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["8p"],
    paddingHorizontal: 0,
  }));

  const sectionStyles = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["20p"],
  }));
  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);
  return (
    <Page insets={["bottom"]} backgroundColor="neutralBase-60">
      <CustomStatusBar barStyle="light-content" backgroundColor={NavHeaderColor} />
      <NavHeader
        title={t("Settings.CustomerAccountManagementScreen.title")}
        onBackPress={handleOnBackPress}
        backgroundColor={NavHeaderColor}
        backgroundAngledColor={NavHeaderColor}
        variant="white"
      />

      <ContentContainer style={containerStyles} isScrollView>
        <SettingsCategoryContainer
          categoryName={t("Settings.CustomerAccountManagementScreen.personal")}
          style={sectionStyles}>
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.profileDetailsTitle")}
            description={t("Settings.CustomerAccountManagementScreen.profileDetailsDescription")}
            icon={<ProfileDetailsIcon />}
            onPress={handleOnProfileDetailsPress}
          />

          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.financialInformationTitle")}
            description={t("Settings.CustomerAccountManagementScreen.financialInformationDescription")}
            icon={<FinancialInformationIcon />}
            onPress={handleOnFinancialInformationPress}
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.todosTitle")}
            description={t("Settings.CustomerAccountManagementScreen.todosDescription")}
            icon={<TodosIcon />}
            onPress={handleOnTodosPress}
          />
        </SettingsCategoryContainer>
        <Divider color="neutralBase-40" height={4} />
        <SettingsCategoryContainer
          categoryName={t("Settings.CustomerAccountManagementScreen.preferences")}
          style={sectionStyles}>
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.lifestyleTitle")}
            description={t("Settings.CustomerAccountManagementScreen.lifestyleDescription")}
            icon={<LifestyleIcon />}
            onPress={handleOnLifeStylePress}
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.notificationsTitle")}
            description={t("Settings.CustomerAccountManagementScreen.notificationsDescription")}
            icon={<NotificationsIcon />}
            onPress={handleNotificationPress}
          />
          <SettingLanguagesSection
            title={t("Settings.CustomerAccountManagementScreen.languageTitle")}
            description={t("Settings.CustomerAccountManagementScreen.languageDescription")}
            icon={<LanguageIcon />}
          />
        </SettingsCategoryContainer>
        <Divider color="neutralBase-40" height={4} />
        <SettingsCategoryContainer
          categoryName={t("Settings.CustomerAccountManagementScreen.account")}
          style={sectionStyles}>
          {/* TODO: pending to developed from BE and FE */}
          {/* <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.yourSubscriptionTitle")}
            description={t("Settings.CustomerAccountManagementScreen.yourSubscriptionDescription")}
            icon={<YourSubscriptionIcon />}
            onPress={handleOnSubscriptionManagementPress}
          /> */}
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.passcodeTitle")}
            description={t("Settings.CustomerAccountManagementScreen.passcodeDescription")}
            icon={<PasscodeIcon />}
            onPress={handleOnPassCodePress}
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.biometricAuthenticationTitle")}
            description={t("Settings.CustomerAccountManagementScreen.biometricAuthenticationDescription")}
            icon={<BiometricAuthenticationIcon />}
            onPress={handleBiometricPress}
            RightIcon={
              <Switch
                trackColor={{ false: theme.palette.neutralBase, true: theme.palette.complimentBase }}
                onValueChange={handleBiometricPress}
                value={isBiometricEnabled}
                disabled={!isRegisteredDevice}
              />
            }
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.myCasesTitle")}
            description={t("Settings.CustomerAccountManagementScreen.myCasesDescription")}
            icon={<MyCasesIcon />}
            onPress={handleMyCasesPress}
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.inviteFriend")}
            description={t("Settings.CustomerAccountManagementScreen.earnSAR")}
            icon={<InviteFriendIcon />}
            onPress={handleInviteFriendPress}
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.aliasManagment")}
            description={t("Settings.CustomerAccountManagementScreen.aliasManagmentDescription")}
            icon={<AliasManagmentIcon />}
            onPress={handleAliasManagmentPress}
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.panicMode")}
            description={t("Settings.CustomerAccountManagementScreen.panicModeDescription")}
            icon={<PanicModeIcon />}
            onPress={handleOnActivePanicModeModal}
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.deviceManagement")}
            description={t("Settings.CustomerAccountManagementScreen.deviceManagementDescription")}
            icon={<PanicModeIcon />}
            onPress={handleOnDeviceManagementClick}
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.connectedServices")}
            description={t("Settings.CustomerAccountManagementScreen.connectedServicesDescription")}
            icon={<ConnectedServicesIcon />}
            onPress={handleConnectedServicesPress}
          />
        </SettingsCategoryContainer>

        <Divider color="neutralBase-40" height={4} />
        <SettingsCategoryContainer categoryName={t("Settings.HomeCustomization.customization")} style={sectionStyles}>
          <SettingSection
            title={t("Settings.HomeCustomization.title")}
            description={t("Settings.HomeCustomization.description")}
            icon={<AliasManagmentIcon />}
            onPress={handleEditHomePress}
          />
        </SettingsCategoryContainer>
        <Divider color="neutralBase-40" height={4} />
        <SettingsCategoryContainer style={sectionStyles}>
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.signOutTitle")}
            description={t("Settings.CustomerAccountManagementScreen.signOutDescription")}
            icon={<SignOutIcon />}
            onPress={handleSignOutPress}
          />
        </SettingsCategoryContainer>
        <View style={styles.versionContainer}>
          <Typography.Text color="neutralBase+10" size="footnote">
            {getAppVerionDetails()}
          </Typography.Text>
        </View>
      </ContentContainer>
      <NotificationModal
        message={t("ProxyAlias.AccountModal.PasscodeUpdateLimitMessage")}
        isVisible={hasReachedPasscodeUpdateLimit}
        title={t("ProxyAlias.AccountModal.PasscodeUpdateLimitTitle")}
        onClose={handleReachedPasscodeUpdateLimit}
        variant="error"
        buttons={{
          primary: <Button onPress={handleReachedPasscodeUpdateLimit}>{t("ProxyAlias.ErrorModal.ok")}</Button>,
        }}
      />
      <NotificationModal
        message={t("Settings.BiometricScreen.disableModal.description")}
        isVisible={showDisableBiometricsModal}
        title={t("Settings.BiometricScreen.disableModal.title")}
        onClose={() => setShowDisableBiometricsModal(false)}
        variant="confirmations"
        buttons={{
          primary: (
            <Button testID="SignIn.PasscodeScreen:ProccedButton" onPress={handleDisableBiometrics}>
              {t("Settings.BiometricScreen.disableModal.confirm")}
            </Button>
          ),
          secondary: (
            <Button testID="SignIn.PasscodeScreen:CancelButton" onPress={() => setShowDisableBiometricsModal(false)}>
              {t("Settings.BiometricScreen.disableModal.cancel")}
            </Button>
          ),
        }}
      />
      <NotificationModal
        variant="error"
        title={t("Settings.LogoutFailedModal.title")}
        message={t("Settings.LogoutFailedModal.message")}
        isVisible={isLogoutFailedModalVisible}
        onClose={() => setIsLogoutFailedModalVisible(false)}
      />
      <NotificationModal
        testID="SignIn.PasscodeScreen:PanicModal"
        variant="warning"
        title={t("SignIn.PanicModeScreen.modal.activeTitle")}
        onClose={() => setIsActivePanicModeModal(false)}
        message={t("SignIn.PanicModeScreen.modal.activeMessage")}
        isVisible={isActivePanicModeModal}
        buttons={{
          primary: (
            <Button testID="SignIn.PasscodeScreen:ProccedButton" onPress={handleOnActivePanicMode}>
              {t("SignIn.PanicModeScreen.buttons.confirm")}
            </Button>
          ),
          secondary: (
            <Button testID="SignIn.PasscodeScreen:CancelButton" onPress={() => setIsActivePanicModeModal(false)}>
              {t("SignIn.PasscodeScreen.signInModal.cancelButton")}
            </Button>
          ),
        }}
      />
      <NotificationModal
        testID="CardActions.VerifyPinScreen:errorPanicModal"
        variant="error"
        title={t("CardActions.VerifyPinScreen.errorPanicModal.title")}
        message={t("CardActions.VerifyPinScreen.errorPanicModal.message")}
        isVisible={isSubmitPanicErrorVisible}
        onClose={() => setIsSubmitPanicErrorVisible(false)}
      />
      <SignOutModal
        isRegisteredDevice={isRegisteredDevice}
        isVisible={isSignOutModalVisible}
        onClose={handleOnClose}
        onCloseError={handleOnCloseError}
      />
      <EditHomeConfiguration isVisible={isEditHomeConfigurationVisible} onClose={handleOnCloseEditHomeConfiguration} />
    </Page>
  );
}

const styles = StyleSheet.create({
  versionContainer: { alignItems: "center", justifyContent: "center" },
});
