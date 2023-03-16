import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, AppState, Linking, Pressable, View, ViewStyle } from "react-native";
import { checkNotifications } from "react-native-permissions";

import { InfoCircleIcon, TransferHorizontalIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import Modal from "@/components/Modal";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { mockNotificationManagementCategories } from "@/mocks/notificationManagementCategories";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import Section from "./CategorySection";

export default function HubScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [appActive, setAppActive] = useState(true);
  const [alertShown, setAlertShown] = useState(false);

  const handleOnModalClose = () => {
    setIsInfoModalVisible(false);
  };

  const modalContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["32p"],
    paddingHorizontal: theme.spacing["16p"],
  }));

  const infoIconContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["8p"],
  }));

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["4p"],
  }));

  const subtitleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["8p"],
    paddingBottom: theme.spacing["24p"],
  }));

  const categoriesContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const infoIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-10"]);
  const horizontalIconColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);

  useEffect(() => {
    checkNotifications().then(({ status }) => {
      if (!alertShown && status !== "granted") {
        Alert.alert(
          t("NotificationManagement.PermissionAlertModal.title"),
          t("NotificationManagement.PermissionAlertModal.subtitle"),
          [
            {
              text: t("NotificationManagement.PermissionAlertModal.back"),
              style: "cancel",
              onPress: () => {
                setAlertShown(true);
                navigation.goBack();
              },
            },
            {
              text: t("NotificationManagement.PermissionAlertModal.settings"),
              onPress: () => {
                setAlertShown(true);
                Linking.openSettings();
              },
            },
          ]
        );
      }
    });

    const listener = AppState.addEventListener("change", state => {
      if (state === "background" || state === "inactive") {
        setAppActive(false);
        setAlertShown(false);
      } else if (state === "active") {
        setAppActive(true);
      }
    });

    return () => {
      listener.remove();
    };
  }, [appActive]);

  return (
    <>
      <Page backgroundColor="primaryBase-60">
        <NavHeader />
        <ContentContainer isScrollView>
          <View>
            <Stack direction="horizontal" align="center" style={titleContainerStyle}>
              <Typography.Text weight="semiBold" size="title1">
                {t("NotificationManagement.HubScreen.title")}
              </Typography.Text>
              <Pressable
                style={infoIconContainer}
                onPress={() => {
                  setIsInfoModalVisible(true);
                }}>
                <InfoCircleIcon color={infoIconColor} />
              </Pressable>
            </Stack>
            <Typography.Text weight="regular" size="callout" style={subtitleContainerStyle}>
              {t("NotificationManagement.HubScreen.subtitle")}
            </Typography.Text>
            <Stack direction="vertical" align="stretch">
              {mockNotificationManagementCategories.categories.map(data => {
                return (
                  <View style={categoriesContainerStyle} key={data.categoryId}>
                    <Section
                      title={data.categoryName}
                      content={data.categoryDescription}
                      icon={<TransferHorizontalIcon color={horizontalIconColor} />}
                      data={data}
                    />
                  </View>
                );
              })}
            </Stack>
          </View>
        </ContentContainer>
      </Page>
      <Modal visible={isInfoModalVisible} onClose={handleOnModalClose}>
        <View style={modalContainerStyle}>
          <Stack direction="vertical" gap="8p">
            <Typography.Text color="neutralBase+30" size="title2" weight="bold">
              {t("NotificationManagement.HubScreen.modalTitle")}
            </Typography.Text>
            <Typography.Text color="neutralBase+30" size="callout">
              {t("NotificationManagement.HubScreen.modalContent")}
            </Typography.Text>
          </Stack>
        </View>
      </Modal>
    </>
  );
}
