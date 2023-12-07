import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { FinancialInformationIcon, LifestyleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import CustomStatusBar from "@/components/CustomStatusBar/CustomStatusBar";
import Divider from "@/components/Divider";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import SignOutModal from "@/components/SignOutModal";
import { usePanicMode } from "@/features/SignIn/hooks/query-hooks";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";
import { getItemFromEncryptedStorage } from "@/utils/encrypted-storage";

import {
  AliasManagmentIcon,
  BiometricAuthenticationIcon,
  ConnectedServicesIcon,
  LanguageIcon,
  MyCasesIcon,
  NotificationsIcon,
  PasscodeIcon,
  ProfileDetailsIcon,
  SignOutIcon,
  YourSubscriptionIcon,
} from "../assets/icons";
import PanicModeIcon from "../assets/icons/PanicModeIcon";
import {
  EditHomeConfiguration,
  SettingLanguagesSection,
  SettingsCategoryContainer,
  SettingSection,
} from "../components";
import { useCheckDailyPasscodeLimit } from "../hooks/query-hooks";

export default function CustomerAccountManagement() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { refetch: checkDailyPasscodeLimit } = useCheckDailyPasscodeLimit();
  const { mutateAsync: editPanicMode } = usePanicMode();

  const [isSignOutModalVisible, setIsSignOutModalVisible] = useState(false);
  const [isEditHomeConfigurationVisible, setIsEditHomeConfigurationVisible] = useState(false);
  const [hasReachedPasscodeUpdateLimit, setHasReachedPasscodeUpdateLimit] = useState(false);
  const [isLogoutFailedModalVisible, setIsLogoutFailedModalVisible] = useState<boolean>(false);
  const [isActivePanicModeModal, setIsActivePanicModeModal] = useState<boolean>(false);
  const [user, setUser] = useState<boolean>(false);
  const [isSubmitPanicErrorVisible, setIsSubmitPanicErrorVisible] = useState<boolean>(false);

  useEffect(() => {
    const getUser = async () => {
      const userData = await getItemFromEncryptedStorage("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        const tempUserData = await getItemFromEncryptedStorage("tempUser");
        setUser(tempUserData ? JSON.parse(tempUserData) : null);
      }
    };
    getUser();
  }, []);

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

  const handleBiometricPress = () => {
    navigation.navigate("Settings.BiometricScreen");
  };

  const handleSignOutPress = () => {
    setIsSignOutModalVisible(true);
  };

  const handleEditHomePress = () => {
    setIsEditHomeConfigurationVisible(true);
  };

  const handleOnProfileDetailsPress = () => {
    navigation.navigate("ProfileDetails.ProfileDetailsStack");
  };

  const handleOnLifeStylePress = () => {
    navigation.navigate("Settings.LifeStyleScreen");
  };

  const handleOnFinancialInformationPress = () => {
    navigation.navigate("Settings.FinancialInformationScreen");
  };

  const handleAliasManagmentPress = () => {
    navigation.navigate("ProxyAlias.ProxyAliasStack", { screen: "ProxyAlias.AliasManagementScreen" });
  };

  const handleOnActivePanicModeModal = () => {
    setIsActivePanicModeModal(true);
  };

  const handleOnActivePanicMode = async () => {
    try {
      await editPanicMode({
        isPanic: true,
        nationalId: user.NationalId,
        mobileNumber: user.MobileNumber,
      });
      // TODO use logout logic when it fixed beacuse its not working
      // await signOutUser(logoutActionsIds.MANUALLY_ID);
      navigation.navigate("SignIn.SignInStack", {
        screen: "SignIn.Iqama",
      });
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

  const handleOnSubscriptionManagementPress = () => {
    // TODO: TemporarySubscriptionManagementScreen will be removed from this Settings Stack when implemented by Smart Choices Domain team
    navigation.navigate("Settings.TemporarySubscriptionManagementScreen");
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

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({ paddingTop: theme.spacing["8p"] }));
  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);
  return (
    <Page backgroundColor="neutralBase-60" insets={["top", "bottom"]}>
      <NavHeader
        title={t("Settings.CustomerAccountManagementScreen.title")}
        onBackPress={handleOnBackPress}
        backgroundColor={NavHeaderColor}
        variant="white"
      />
      <CustomStatusBar barStyle="light-content" backgroundColor={NavHeaderColor} />
      <ContentContainer style={containerStyles} isScrollView>
        <SettingsCategoryContainer categoryName={t("Settings.CustomerAccountManagementScreen.personal")}>
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
        </SettingsCategoryContainer>
        <Divider color="neutralBase-10" height={1} />
        <SettingsCategoryContainer categoryName={t("Settings.CustomerAccountManagementScreen.preferences")}>
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
        <Divider color="neutralBase-10" height={1} />
        <SettingsCategoryContainer categoryName={t("Settings.CustomerAccountManagementScreen.account")}>
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.yourSubscriptionTitle")}
            description={t("Settings.CustomerAccountManagementScreen.yourSubscriptionDescription")}
            icon={<YourSubscriptionIcon />}
            onPress={handleOnSubscriptionManagementPress}
          />
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
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.myCasesTitle")}
            description={t("Settings.CustomerAccountManagementScreen.myCasesDescription")}
            icon={<MyCasesIcon />}
            onPress={handleMyCasesPress}
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
            title={t("Settings.CustomerAccountManagementScreen.connectedServices")}
            description={t("Settings.CustomerAccountManagementScreen.connectedServicesDescription")}
            icon={<ConnectedServicesIcon />}
            onPress={handleConnectedServicesPress}
          />
        </SettingsCategoryContainer>

        <Divider color="neutralBase-10" height={1} />
        <SettingsCategoryContainer categoryName={t("Settings.HomeCustomization.customization")}>
          <SettingSection
            title={t("Settings.HomeCustomization.title")}
            description={t("Settings.HomeCustomization.description")}
            icon={<AliasManagmentIcon />}
            onPress={handleEditHomePress}
          />
        </SettingsCategoryContainer>
        <Divider color="neutralBase-10" height={1} />
        <SettingsCategoryContainer>
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.signOutTitle")}
            description={t("Settings.CustomerAccountManagementScreen.signOutDescription")}
            icon={<SignOutIcon />}
            onPress={handleSignOutPress}
          />
        </SettingsCategoryContainer>
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
      <SignOutModal isVisible={isSignOutModalVisible} onClose={handleOnClose} onCloseError={handleOnCloseError} />
      <EditHomeConfiguration isVisible={isEditHomeConfigurationVisible} onClose={handleOnCloseEditHomeConfiguration} />
    </Page>
  );
}
