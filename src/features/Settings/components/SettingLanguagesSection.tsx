import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { AngleDownIcon, AngleUpIcon } from "@/assets/icons";
import Button from "@/components/Button";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useToasts } from "@/contexts/ToastsContext";
import { useCustomerProfile } from "@/hooks/use-customer-profile";
import { useChangeLanguage } from "@/i18n";
import reloadApp from "@/i18n/reload-app";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

import * as SettingsIcons from "../assets/icons";
import { useUpdateCustomerProfileLanguage } from "../hooks/query-hooks";
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
  const addToast = useToasts();

  const { handleHideRestartModal, handleShowRestartModal, handleOnChange, isRestartModalVisible } = useChangeLanguage();
  const { data: userInformation, isFetching } = useCustomerProfile();
  const { mutateAsync: updateCustomerProfileLanguages, isLoading } = useUpdateCustomerProfileLanguage();

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedApplicationLanguage, setSelectedApplicationLanguage] = useState<string>();
  const [selectedLanguageOption, setSelectedLanguageOption] = useState<string>();
  const [isSelectingLanguageModalVisible, setIsSelectingLanguageModalVisible] = useState(false);

  const handleOnExpandPress = () => setIsExpanded(c => !c);

  const handleOnLanguageOptionPress = (option: string) => {
    setSelectedLanguageOption(option);
    setIsSelectingLanguageModalVisible(true);
  };

  const handleOnSelectingLanguageModalClosePress = useCallback(() => {
    setIsSelectingLanguageModalVisible(false);
  }, []);

  // if the application language is changed the user will first be notified that the app needs to restart for that.
  // Only if the user then agrees, the language changed will be saved and the app will be restarted.
  const handleOnSaveChanges = useCallback(
    async (value: string) => {
      if (userInformation && selectedLanguageOption === LanguageOptionType.Notifications) {
        try {
          await updateCustomerProfileLanguages({
            PreferredLanguageCode: userInformation.Language.toUpperCase(),
            NotificationLanguageCode: value.toUpperCase(),
          });
          addToast({
            variant: "success",
            message: t("Settings.ChangeLanguageModal.updateNotificationsLanguageSuccess"),
          });
        } catch (error) {
          warn("Error updating Notifications language:", (error as Error).message);
        } finally {
          setIsSelectingLanguageModalVisible(false);
        }
      } else {
        setIsSelectingLanguageModalVisible(false);
        setSelectedApplicationLanguage(value);
        handleShowRestartModal();
      }
    },
    [selectedLanguageOption, userInformation, updateCustomerProfileLanguages, handleShowRestartModal, addToast, t]
  );

  const handleOnCancelPress = useCallback(() => {
    handleHideRestartModal();
  }, [handleHideRestartModal]);

  const handleOnRestartPress = useCallback(async () => {
    if (userInformation && selectedApplicationLanguage) {
      try {
        await updateCustomerProfileLanguages({
          PreferredLanguageCode: selectedApplicationLanguage.toUpperCase(),
          NotificationLanguageCode: userInformation.NotificationLanguageCode.toUpperCase(),
        });
        await handleOnChange(selectedApplicationLanguage);
        reloadApp();
      } catch (error) {
        warn("Error updating Application language:", ` ${(error as Error).message}`);
      }
    }
  }, [handleOnChange, updateCustomerProfileLanguages, selectedApplicationLanguage, userInformation]);

  const getLanguageName = useCallback(
    (languageCode: string) => {
      if (languageCode.toLowerCase() === LANGUAGES.AR) {
        return t("Settings.language.AR");
      } else {
        return t("Settings.language.EN");
      }
    },
    [t]
  );

  const getSelectLanguageModalTitle = useCallback(() => {
    if (selectedLanguageOption === LanguageOptionType.Application) {
      return t("Settings.ChangeLanguageModal.modalAppTitle");
    } else {
      return t("Settings.ChangeLanguageModal.modalNotificationsTitle");
    }
  }, [selectedLanguageOption, t]);

  const getSelectedLanguage = useCallback(() => {
    if (!userInformation) {
      throw new Error("Can not getSelectedLanguage When UserInformation is undefined");
    }
    if (selectedLanguageOption === LanguageOptionType.Application) {
      return userInformation.Language.toLowerCase();
    } else {
      return userInformation.NotificationLanguageCode.toLowerCase();
    }
  }, [userInformation, selectedLanguageOption]);

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
          userInformation === undefined || isFetching ? (
            <FlexActivityIndicator />
          ) : (
            <Stack direction="horizontal" gap="12p" style={languageOptionsContainerStyle}>
              <LanguageOption
                id={LanguageOptionType.Application}
                title={t("Settings.ChangeLanguageModal.applicationOptionTitle")}
                currentLanguage={getLanguageName(userInformation.Language)}
                icon={<SettingsIcons.AppLanguageIcon />}
                onPress={() => {
                  handleOnLanguageOptionPress(LanguageOptionType.Application);
                }}
              />
              <LanguageOption
                id={LanguageOptionType.Notifications}
                title={t("Settings.ChangeLanguageModal.notificationsOptionTitle")}
                currentLanguage={getLanguageName(userInformation.NotificationLanguageCode)}
                icon={<SettingsIcons.NotificationsLanguageIcon />}
                onPress={() => {
                  handleOnLanguageOptionPress(LanguageOptionType.Notifications);
                }}
              />
            </Stack>
          )
        ) : null}
      </Stack>
      {userInformation !== undefined ? (
        <View style={styles.modalsContainer}>
          {!isRestartModalVisible ? (
            <SelectingLanguageModal
              onClose={handleOnSelectingLanguageModalClosePress}
              onSaveChanges={handleOnSaveChanges}
              isVisible={isSelectingLanguageModalVisible}
              title={getSelectLanguageModalTitle()}
              selectedLanguage={getSelectedLanguage()}
              isSaveButtonLoading={isLoading}
            />
          ) : null}
          <NotificationModal
            variant="warning"
            title={t("Settings.ChangeLanguageModal.restartRequired")}
            message={t("Settings.ChangeLanguageModal.restartMessage")}
            isVisible={isRestartModalVisible}
            buttons={{
              primary: (
                <Button onPress={handleOnRestartPress} disabled={isLoading}>
                  {t("Settings.ChangeLanguageModal.restartNow")}
                </Button>
              ),
              secondary: (
                <Button onPress={handleOnCancelPress} disabled={isLoading}>
                  {t("Settings.ChangeLanguageModal.cancelButton")}
                </Button>
              ),
            }}
          />
        </View>
      ) : null}
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
