import { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { AngleDownIcon, AngleUpIcon } from "@/assets/icons";
import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useCustomerProfile } from "@/hooks/use-customer-profile";
import { useChangeLanguage } from "@/i18n";
import reloadApp from "@/i18n/reload-app";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

import * as SettingsIcons from "../assets/icons";
import { useLanguagePreferred } from "../hooks/query-hooks";
import { LanguageOptionType, LANGUAGES } from "../types";
import LanguageOption from "./LanguageOption";
import SelectingLanguageModal from "./SelectingLanguageModal";

interface SettingLanguagesSectionProps {
  title: string;
  description: string;
  icon: React.ReactElement<SvgProps>;
}

export default function SettingLanguagesSection({ title, description, icon }: SettingLanguagesSectionProps) {
  const { t } = useTranslation();

  const { handleHideRestartModal, handleOnChange } = useChangeLanguage();

  const [isExpanded, setIsExpanded] = useState(false);
  const { data: userInformation } = useCustomerProfile();

  const [preferredLanguage, setPreferredLanguage] = useState(userInformation?.Language || LANGUAGES.EN);

  const [notificationLanguage, setNotificationLanguage] = useState(
    userInformation?.NotificationLanguageCode || LANGUAGES.EN
  );

  const [selectedLanguageOption, setSelectedLanguageOption] = useState();
  const [isSelectingLanguageModalVisible, setIsSelectingLanguageModalVisible] = useState(false);
  const [isRestartModalVisible, setIsRestartModalVisible] = useState(false);

  const submitLanguagePreferred = useLanguagePreferred();

  const handleOnExpandPress = () => setIsExpanded(c => !c);
  const handleOnLanguageOptionPress = (option: string) => {
    setSelectedLanguageOption(option);
    setIsSelectingLanguageModalVisible(true);
  };

  const handleOnSelectingLanguageModalClosePress = () => {
    setIsSelectingLanguageModalVisible(false);
  };

  const handleOnSaveChanges = async (value: string) => {
    if (selectedLanguageOption === LanguageOptionType.Notifications) {
      try {
        setNotificationLanguage(value);

        await submitLanguagePreferred.mutateAsync({
          PreferredLanguageCode: preferredLanguage,
          NotificationLanguageCode: value,
        });
      } catch (error) {
        console.error("Error updating Notifications language:", (error as Error).message);
      } finally {
        setIsSelectingLanguageModalVisible(false);
      }
    } else {
      setIsSelectingLanguageModalVisible(false);
      handleOnChange(value);
      setPreferredLanguage(value);
      setIsRestartModalVisible(true);
    }
  };

  const handleOnCancelPress = () => {
    handleHideRestartModal();
  };

  const handleOnRestartPress = async () => {
    try {
      await submitLanguagePreferred.mutateAsync({
        PreferredLanguageCode: preferredLanguage,
        NotificationLanguageCode: notificationLanguage,
      });
    } catch (error) {
      warn("Error updating Application language:", ` ${(error as Error).message}`);
    }

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
              id={LanguageOptionType.Application}
              title={t("Settings.ChangeLanguageModal.applicationOptionTitle")}
              currentLanguage={t(`Settings.language.${userInformation?.Language}`)}
              icon={<SettingsIcons.AppLanguageIcon />}
              onPress={() => {
                handleOnLanguageOptionPress(LanguageOptionType.Application);
              }}
            />
            <LanguageOption
              id={LanguageOptionType.Notifications}
              title={t("Settings.ChangeLanguageModal.notificationsOptionTitle")}
              currentLanguage={t(`Settings.language.${userInformation?.NotificationLanguageCode.toUpperCase()}`)}
              icon={<SettingsIcons.NotificationsLanguageIcon />}
              onPress={() => {
                handleOnLanguageOptionPress(LanguageOptionType.Notifications);
              }}
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
            currentLang={
              selectedLanguageOption === LanguageOptionType.Notifications
                ? userInformation?.NotificationLanguageCode
                : userInformation?.Language
            }
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
