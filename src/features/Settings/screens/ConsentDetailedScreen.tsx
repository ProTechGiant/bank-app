import { RouteProp, useRoute } from "@react-navigation/native";
import { format, isAfter, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, ScrollView, StyleSheet, TextInput, TextStyle, View, ViewStyle } from "react-native";

import { EditIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Accordion from "@/components/Accordion";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";

import { CancelIcon } from "../assets/icons/CancelIcon";
import ConnectedServicesStatusView from "../components/ConnectedServicesStatusView";
import { consetntDetailed } from "../mock/ConnectedServices.mock";

export default function ConsentDetailedScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "Settings.ConsentDetailedScreen">>();

  const consentStatus = route.params?.consentStatus;
  // const consentId = route.params?.consentId;

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(consetntDetailed.TPPInfo.TPPNickName);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [showModal, setShowModal] = useState<{
    isVisible: boolean;
    type: "success" | "error";
  }>({
    isVisible: false,
    type: "success",
  });

  const inputRef = useRef<TextInput>(null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditingClose = () => {
    setIsEditing(false);
  };

  const handleOnConfirmDisconnected = () => {
    // TODO handle the disconnected after API is ready
    setIsConfirmationModalVisible(false);
    delayTransition(() =>
      setShowModal({
        isVisible: true,
        type: "success",
      })
    );
  };

  const handleOnClose = () => {
    setShowModal({ isVisible: false, type: "success" });
  };

  const handleOnGoBack = () => {
    navigation.navigate("Settings.ConnectedServicesScreen");
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
    marginBottom: theme.spacing["20p"],
    marginTop: theme.spacing["8p"],
  }));

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
    marginTop: theme.spacing["24p"],
  }));

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["24p"],
    marginHorizontal: theme.spacing["24p"],
  }));

  const editInputStyle = useThemeStyles<TextStyle>(theme => ({
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 12,
    paddingStart: 14,
    paddingVertical: theme.spacing["12p"],
    width: "100%",
    flex: 1,
  }));

  const badgeStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-start",
    paddingVertical: theme.spacing["4p"],
    marginBottom: theme.spacing["8p"],
  }));

  const editIconColor = useThemeStyles(theme => theme.palette.primaryBase);

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader withBackButton={true} />

      <ScrollView>
        <View style={headerStyle}>
          <View style={badgeStyle}>
            <ConnectedServicesStatusView status={consentStatus} />
          </View>
          <View style={styles.spacingStyle}>
            {isEditing ? (
              <View style={styles.searchTextContainer}>
                <TextInput
                  ref={inputRef}
                  style={editInputStyle}
                  onChangeText={text => setEditedText(text)}
                  onFocus={() => setIsEditing(true)}
                  onBlur={() => setIsEditing(false)}
                  value={editedText}
                  testID="ViewTransactions.CategoriesListScreen:SearchInput"
                />
                <Pressable onPress={handleEditingClose} style={styles.iconStyle}>
                  <CancelIcon />
                </Pressable>
              </View>
            ) : (
              <>
                <Typography.Text size="title2" weight="medium">
                  {editedText}
                </Typography.Text>
                <Pressable onPress={handleEditClick}>
                  <EditIcon color={editIconColor} />
                </Pressable>
              </>
            )}
          </View>
        </View>
        <Stack direction="vertical" style={containerStyle} gap="16p">
          {consetntDetailed.TPPInfo.Accounts
            ? consetntDetailed.TPPInfo.Accounts.map(account => (
                <Stack key={account.Id} direction="vertical">
                  <Typography.Text size="footnote" weight="regular" color="neutralBase+10">
                    {account.Type}
                  </Typography.Text>
                  <Typography.Text size="footnote" weight="regular" color="neutralBase+10">
                    {account.Id}
                  </Typography.Text>
                </Stack>
              ))
            : null}
          {consetntDetailed.TPPInfo.Cards
            ? consetntDetailed.TPPInfo.Cards.map(card => (
                <Stack key={card.AccountNumber} direction="vertical">
                  <Typography.Text size="footnote" weight="regular" color="neutralBase+10">
                    {card.Type}
                  </Typography.Text>
                  <Typography.Text size="footnote" weight="regular" color="neutralBase+10">
                    {card.AccountNumber}
                  </Typography.Text>
                </Stack>
              ))
            : null}
        </Stack>
        <Divider color="neutralBase-40" height={4} />

        <Stack gap="12p" direction="vertical" style={containerStyle}>
          <Typography.Text color="neutralBase+30" size="title2" weight="medium">
            {t("Settings.ConsentDetailedScreen.sharedData")}
          </Typography.Text>
          {consetntDetailed.TPPInfo.GroupsListData
            ? consetntDetailed.TPPInfo.GroupsListData.map((item, index) => (
                <Accordion
                  showIcon={false}
                  key={index}
                  title={i18n.language === "en" ? item.DataGroupNameEnglish : item.DataGroupNameArabic}
                  children={item.PermissionsList.map((Permission, dataIndex) => (
                    <Typography.Text size="footnote" color="neutralBase+10" weight="regular" key={dataIndex}>
                      {dataIndex + 1}.{" "}
                      {i18n.language === "en"
                        ? Permission.PermissionDescriptionEnglish
                        : Permission.PermissionDescriptionArabic}
                    </Typography.Text>
                  ))}
                />
              ))
            : null}
        </Stack>
        <Stack direction="vertical" style={containerStyle}>
          <Typography.Text color="neutralBase+30" size="callout" weight="medium">
            {t("Settings.ConsentDetailedScreen.firstConnected")}
          </Typography.Text>
          <Typography.Text size="footnote" weight="regular" color="neutralBase+10">
            {consetntDetailed.TPPInfo.CreationDateTime
              ? format(parseISO(consetntDetailed.TPPInfo.CreationDateTime), "dd/MM/yyyy")
              : "dd/MM/yyyy"}
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" style={containerStyle}>
          <Typography.Text color="neutralBase+30" size="callout" weight="medium">
            {t("Settings.ConsentDetailedScreen.expiryDate")}
          </Typography.Text>
          <Typography.Text size="footnote" weight="regular" color="neutralBase+10">
            {consetntDetailed.TPPInfo.ExiprationDateTime
              ? isAfter(parseISO(consetntDetailed.TPPInfo.ExiprationDateTime), new Date())
                ? t("Settings.ConsentDetailedScreen.ongoing")
                : format(parseISO(consetntDetailed.TPPInfo.ExiprationDateTime), "dd/MM/yyyy")
              : "dd/MM/yyyy"}
          </Typography.Text>
        </Stack>
        <View style={buttonsContainerStyle}>
          <Button onPress={() => setIsConfirmationModalVisible(true)} variant="secondary">
            {t("Settings.ConsentDetailedScreen.disconnect")}
          </Button>
        </View>

        <NotificationModal
          variant="warning"
          title={t("Settings.ConsentDetailedConfirmModal.title")}
          message={t("Settings.ConsentDetailedConfirmModal.subtitle")}
          isVisible={isConfirmationModalVisible}
          buttons={{
            primary: (
              <Button onPress={handleOnConfirmDisconnected}>{t("Settings.ConsentDetailedConfirmModal.confirm")}</Button>
            ),
            secondary: (
              <Button onPress={() => setIsConfirmationModalVisible(false)}>
                {t("Settings.ConsentDetailedConfirmModal.cancel")}
              </Button>
            ),
          }}
        />

        {showModal.type === "success" ? (
          <NotificationModal
            variant={showModal.type}
            title={t("Settings.ConsentDetailedConfirmModal.successMessage")}
            message={t("Settings.ConsentDetailedConfirmModal.subSuccessMessage")}
            isVisible={showModal.isVisible}
            buttons={{
              primary: <Button onPress={handleOnGoBack}>{t("Settings.ConsentDetailedConfirmModal.goBack")}</Button>,
            }}
          />
        ) : (
          <NotificationModal
            variant={showModal.type}
            title={t("Settings.ConsentDetailedConfirmModal.errorMessage")}
            message={t("Settings.ConsentDetailedConfirmModal.subErrorMessage")}
            isVisible={showModal.isVisible}
            onClose={handleOnClose}
          />
        )}
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  iconStyle: {
    [I18nManager.isRTL ? "left" : "right"]: 14,
    position: "absolute",
  },
  searchTextContainer: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  spacingStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
