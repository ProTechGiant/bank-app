import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import Divider from "@/components/Divider";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import * as SettingsIcons from "../assets/icons";
import { SettingsCategoryContainer, SettingSection } from "../components";

export default function CustomerAccountManagement() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnBackPress = () => {
    navigation.goBack();
  };
  // this function will be changed when integrate screens with this stack
  const handleOnPress = () => {
    // navigation.goBack();
  };

  const handleOnPassCodePress = () => {
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
    navigation.navigate("Settings.AccountSettings");
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
            onPress={handleOnPress}
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.financialInformationTitle")}
            description={t("Settings.CustomerAccountManagementScreen.financialInformationDescription")}
            icon={<SettingsIcons.FinancialInformationIcon />}
            onPress={handleOnPress}
          />
        </SettingsCategoryContainer>
        <Divider color="neutralBase-10" height={1} />
        <SettingsCategoryContainer categoryName={t("Settings.CustomerAccountManagementScreen.preferences")}>
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.lifestyleTitle")}
            description={t("Settings.CustomerAccountManagementScreen.lifestyleDescription")}
            icon={<SettingsIcons.LifestyleIcon />}
            onPress={handleOnPress}
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.notificationsTitle")}
            description={t("Settings.CustomerAccountManagementScreen.notificationsDescription")}
            icon={<SettingsIcons.NotificationsIcon />}
            onPress={handleOnPress}
          />
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.languageTitle")}
            description={t("Settings.CustomerAccountManagementScreen.languageDescription")}
            icon={<SettingsIcons.LanguageIcon />}
            onPress={handleOnPress}
          />
        </SettingsCategoryContainer>
        <Divider color="neutralBase-10" height={1} />
        <SettingsCategoryContainer categoryName={t("Settings.CustomerAccountManagementScreen.account")}>
          <SettingSection
            title={t("Settings.CustomerAccountManagementScreen.yourSubscriptionTitle")}
            description={t("Settings.CustomerAccountManagementScreen.yourSubscriptionDescription")}
            icon={<SettingsIcons.YourSubscriptionIcon />}
            onPress={handleOnPress}
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
    </Page>
  );
}
