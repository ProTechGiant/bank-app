import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";
import Typography from "@/components/Typography";
import { useChangeLanguage } from "@/i18n";
import reloadApp from "@/i18n/reload-app";
import useThemeStyles from "@/theme/use-theme-styles";

export default function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const { handleOnChange, handleHideRestartModal, handleShowRestartModal, isRestartModalVisible } = useChangeLanguage();

  const handleOnPress = () => {
    handleShowRestartModal();
  };

  const handleOnCancelPress = () => {
    handleHideRestartModal();
  };

  const handleOnRestartPress = async () => {
    await handleOnChange(i18n.language === "en" ? "ar" : "en");
    reloadApp();
  };

  const languageSelectViewStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+10"],
    borderRadius: theme.radii.medium,
    justifyContent: "center",
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["8p"],
  }));

  return (
    <View>
      <Pressable style={languageSelectViewStyle} onPress={handleOnPress}>
        <Typography.Text color="neutralBase-50" size="footnote">
          {i18n.language === "en" ? "العربية" : "EN"}
        </Typography.Text>
      </Pressable>
      <NotificationModal
        variant="warning"
        title={t("Settings.ChangeLanguageModal.restartRequired")}
        message={t("Settings.ChangeLanguageModal.restartMessage")}
        isVisible={isRestartModalVisible}
        buttons={{
          primary: <Button onPress={handleOnRestartPress}>{t("Settings.ChangeLanguageModal.restartNow")}</Button>,
          secondary: <Button onPress={handleOnCancelPress}>{t("Settings.ChangeLanguageModal.cancelButton")}</Button>,
        }}
      />
    </View>
  );
}
