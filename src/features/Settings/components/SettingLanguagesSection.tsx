import { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { AngleDownIcon, AngleUpIcon } from "@/assets/icons";
import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useChangeLanguage } from "@/i18n";
import reloadApp from "@/i18n/reload-app";
import { useThemeStyles } from "@/theme";

import * as SettingsIcons from "../assets/icons";
import LanguageOption from "./LanguageOption";
import SelectingLanguageModal from "./SelectingLanguageModal";

interface SettingLanguagesSectionProps {
  title: string;
  description: string;
  icon: React.ReactElement<SvgProps>;
}

export default function SettingLanguagesSection({ title, description, icon }: SettingLanguagesSectionProps) {
  const { t } = useTranslation();

  const { handleHideRestartModal, handleOnChange, isRestartModalVisible } = useChangeLanguage();

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedLanguageOption, setSelectedLanguageOption] = useState("");
  const [isSelectingLanguageModalVisible, setIsSelectingLanguageModalVisible] = useState(false);

  const handleOnExpandPress = () => setIsExpanded(c => !c);

  const handleOnLanguageOptionPress = (option: string) => () => {
    setSelectedLanguageOption(option);
    setIsSelectingLanguageModalVisible(true);
  };

  const handleOnSelectingLanguageModalClosePress = () => {
    setIsSelectingLanguageModalVisible(false);
  };

  const handleOnSaveChanges = (value: string) => {
    setIsSelectingLanguageModalVisible(false);
    handleOnChange(value);
  };

  const handleOnCancelPress = () => {
    handleHideRestartModal();
  };

  const handleOnRestartPress = () => {
    // TODO: add await api call here to update selected language then restart the app on success
    reloadApp();
  };

  const languageOptionsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["24p"],
    paddingHorizontal: theme.spacing["20p"],
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const anglesIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  return (
    <View>
      <Stack direction="vertical" align="stretch" gap="12p">
        <Pressable onPress={handleOnExpandPress}>
          <Stack direction="horizontal" gap="16p">
            {icon}
            <Stack direction="vertical" gap="4p" flex={1}>
              <Typography.Text size="callout" weight="medium">
                {title}
              </Typography.Text>
              <Typography.Text color="neutralBase" size="footnote" weight="regular">
                {description}
              </Typography.Text>
            </Stack>
            <View style={[styles.chevronContainer]}>
              {isExpanded ? <AngleUpIcon color={anglesIconColor} /> : <AngleDownIcon color={anglesIconColor} />}
            </View>
          </Stack>
        </Pressable>
        {isExpanded ? (
          <Stack direction="horizontal" gap="12p" style={languageOptionsContainerStyle}>
            <LanguageOption
              title={t("Settings.ChangeLanguageModal.applicationOptionTitle")}
              currentLanguage="English" // TODO: should be added from api
              icon={<SettingsIcons.AppLanguageIcon />}
              onPress={handleOnLanguageOptionPress(t("Settings.ChangeLanguageModal.modalAppTitle"))}
            />
            <LanguageOption
              title={t("Settings.ChangeLanguageModal.notificationsOptionTitle")}
              currentLanguage="العربية" // TODO: should be added from api
              icon={<SettingsIcons.NotificationsLanguageIcon />}
              onPress={handleOnLanguageOptionPress(t("Settings.ChangeLanguageModal.modalNotificationsTitle"))}
            />
          </Stack>
        ) : null}
      </Stack>
      <View style={styles.modalsContainer}>
        {!isRestartModalVisible ? (
          <SelectingLanguageModal
            onClose={handleOnSelectingLanguageModalClosePress}
            onSaveChanges={handleOnSaveChanges}
            isVisible={isSelectingLanguageModalVisible}
            title={selectedLanguageOption}
          />
        ) : null}
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
    </View>
  );
}

const styles = StyleSheet.create({
  chevronContainer: {
    alignSelf: "center",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  modalsContainer: {
    height: 0,
  },
});
