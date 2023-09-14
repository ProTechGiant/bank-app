import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Divider from "@/components/Divider";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import * as SettingsIcons from "../assets/icons";
import {
  EditHomeConfiguration,
  SettingLanguagesSection,
  SettingsCategoryContainer,
  SettingSection,
  SignOutModal,
} from "../components";
// import { useCheckDailyPasscodeLimit } from "../hooks/query-hooks";

export default function CustomerAccountManagement() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  // const { data } = useCheckDailyPasscodeLimit();

  const [isSignOutModalVisible, setSignOutModalVisible] = useState(false);
  const [isEditHomeConfigurationVisible, setIsEditHomeConfigurationVisible] = useState(false);
  const [hasReachedPasscodeUpdateLimit, setHasReachedPasscodeUpdateLimit] = useState(false);

  const handleOnBackPress = () => {
    navigation.goBack();
  };
  // this function will be changed when integrate screens with this stack
  const handleNotificationPress = () => {
    navigation.navigate("NotificationManagement.NotificationManagementStack");
  };

  const handleOnPassCodePress = () => {
    // TODO: When the api is ready, we will use the following code to navigate to the correct screen
    // data?.UpdatePasscodeEnabled
    //   ? navigation.navigate("Passcode.ChangePasscodeStack")
    //   : setHasReachedPasscodeUpdateLimit(true);
    navigation.navigate("Passcode.ChangePasscodeStack");
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
    setSignOutModalVisible(true);
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

  const handleOnSubscriptionManagementPress = () => {
    // TODO: TemporarySubscriptionManagementScreen will be removed from this Settings Stack when implemented by Smart Choices Domain team
    navigation.navigate("Settings.TemporarySubscriptionManagementScreen");
  };

  const handleOnClose = () => {
    setSignOutModalVisible(false);
  };
  const handleOnCloseEditHomeConfiguration = () => {
    setIsEditHomeConfigurationVisible(false);
  };

  const handleReachedPasscodeUpdateLimit = () => {
    setHasReachedPasscodeUpdateLimit(false);
  };

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({ paddingTop: theme.spacing["8p"] }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["top", "bottom"]}>
      <NavHeader title={t("Settings.CustomerAccountManagementScreen.title")} onBackPress={handleOnBackPress} />
      <ContentContainer style={containerStyles} isScrollView>
        <SettingsCategoryContainer categoryName={t("Settings.CustomerAccountManagementScreen.personal")}>
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.profileDetailsTitle")}
            description={t("Settings.CustomerAccountManagementScreen.profileDetailsDescription")}
            icon={<SettingsIcons.ProfileDetailsIcon />}
            onPress={handleOnProfileDetailsPress}
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.financialInformationTitle")}
            description={t("Settings.CustomerAccountManagementScreen.financialInformationDescription")}
            icon={<SettingsIcons.FinancialInformationIcon />}
            onPress={handleOnFinancialInformationPress}
          />
        </SettingsCategoryContainer>
        <Divider color="neutralBase-10" height={1} />
        <SettingsCategoryContainer categoryName={t("Settings.CustomerAccountManagementScreen.preferences")}>
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.lifestyleTitle")}
            description={t("Settings.CustomerAccountManagementScreen.lifestyleDescription")}
            icon={<SettingsIcons.LifestyleIcon />}
            onPress={handleOnLifeStylePress}
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.notificationsTitle")}
            description={t("Settings.CustomerAccountManagementScreen.notificationsDescription")}
            icon={<SettingsIcons.NotificationsIcon />}
            onPress={handleNotificationPress}
          />
          <SettingLanguagesSection
            title={t("Settings.CustomerAccountManagementScreen.languageTitle")}
            description={t("Settings.CustomerAccountManagementScreen.languageDescription")}
            icon={<SettingsIcons.LanguageIcon />}
          />
        </SettingsCategoryContainer>
        <Divider color="neutralBase-10" height={1} />
        <SettingsCategoryContainer categoryName={t("Settings.CustomerAccountManagementScreen.account")}>
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.yourSubscriptionTitle")}
            description={t("Settings.CustomerAccountManagementScreen.yourSubscriptionDescription")}
            icon={<SettingsIcons.YourSubscriptionIcon />}
            onPress={handleOnSubscriptionManagementPress}
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.passcodeTitle")}
            description={t("Settings.CustomerAccountManagementScreen.passcodeDescription")}
            icon={<SettingsIcons.PasscodeIcon />}
            onPress={handleOnPassCodePress}
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.biometricAuthenticationTitle")}
            description={t("Settings.CustomerAccountManagementScreen.biometricAuthenticationDescription")}
            icon={<SettingsIcons.BiometricAuthenticationIcon />}
            onPress={handleBiometricPress}
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.myCasesTitle")}
            description={t("Settings.CustomerAccountManagementScreen.myCasesDescription")}
            icon={<SettingsIcons.MyCasesIcon />}
            onPress={handleMyCasesPress}
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.aliasManagment")}
            description={t("Settings.CustomerAccountManagementScreen.aliasManagmentDescription")}
            icon={<SettingsIcons.AliasManagmentIcon />}
            onPress={handleAliasManagmentPress}
          />
        </SettingsCategoryContainer>

        <Divider color="neutralBase-10" height={1} />
        <SettingsCategoryContainer categoryName={t("Settings.HomeCustomization.customization")}>
          <SettingSection
            title={t("Settings.HomeCustomization.title")}
            description={t("Settings.HomeCustomization.description")}
            icon={<SettingsIcons.AliasManagmentIcon />}
            onPress={handleEditHomePress}
          />
        </SettingsCategoryContainer>
        <Divider color="neutralBase-10" height={1} />
        <SettingsCategoryContainer>
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.signOutTitle")}
            description={t("Settings.CustomerAccountManagementScreen.signOutDescription")}
            icon={<SettingsIcons.SignOutIcon />}
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
      <SignOutModal isVisible={isSignOutModalVisible} onClose={handleOnClose} />
      <EditHomeConfiguration isVisible={isEditHomeConfigurationVisible} onClose={handleOnCloseEditHomeConfiguration} />
    </Page>
  );
}
