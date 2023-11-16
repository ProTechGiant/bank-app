import { RouteProp, useRoute } from "@react-navigation/native";
import { format, isAfter, parseISO } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Accordion from "@/components/Accordion";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";

import ClearableTextInput from "../components/ClearableTextInput";
import ConnectedServicesStatusView from "../components/ConnectedServicesStatusView";
import { useGetConsentDetailed, useRevokeConsent, useUpdateTPPNickName } from "../hooks/query-hooks";
import { ConsentDetailedResponse } from "../types";

export default function ConsentDetailedScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "Settings.ConsentDetailedScreen">>();

  const consentStatus = route.params.consentStatus;
  const consentId = route.params.consentId;

  const { mutateAsync: updateTPPNickName } = useUpdateTPPNickName();
  const { mutateAsync: revokeConsent } = useRevokeConsent();
  const consetntDetailed = useGetConsentDetailed(consentId ?? "").data ?? ({} as ConsentDetailedResponse);

  const [isLoading, setIsLoading] = useState(false);
  const [editedText, setEditedText] = useState(consetntDetailed.TPPInfo?.TPPNickname || "");
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [showModal, setShowModal] = useState<{
    isVisible: boolean;
    type: "success" | "error";
  }>({
    isVisible: false,
    type: "success",
  });

  const handleKeyboardSubmit = async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Use the updateTPPNickName mutation to update the nickname
      if (consentId && editedText) {
        await updateTPPNickName({
          consentId: consentId,
          TPPNickName: editedText,
        });
        // On success
        return true; // Return true to indicate success
      }
    } catch (error) {
      // On failure
    } finally {
      setIsLoading(false);
    }

    return false; // Return false to indicate failure
  };

  const handleOnConfirmDisconnected = async () => {
    try {
      if (consentId)
        await revokeConsent({
          consentId: consentId,
        });
      // On success
      setIsConfirmationModalVisible(false);

      delayTransition(() =>
        setShowModal({
          isVisible: true,
          type: "success",
        })
      );
    } catch (error) {
      // On failure
      delayTransition(() =>
        setShowModal({
          isVisible: true,
          type: "error",
        })
      );
    }
    setIsConfirmationModalVisible(false);
  };

  const handleOnClose = () => {
    setShowModal({ isVisible: false, type: "error" });
  };

  const handleOnGoBack = () => {
    navigation.navigate("Settings.ConnectedServicesScreen");
  };

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

  const badgeStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-start",
    paddingVertical: theme.spacing["4p"],
    marginBottom: theme.spacing["8p"],
  }));

  const initialTPPNickname = consetntDetailed.TPPInfo?.TPPNickname || "";

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader withBackButton={true} />

      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={headerStyle}>
          <View style={badgeStyle}>
            <ConnectedServicesStatusView status={consentStatus} />
          </View>
          <View style={styles.spacingStyle}>
            {consetntDetailed.TPPInfo?.TPPNickname ? (
              <ClearableTextInput
                isLoading={isLoading}
                value={editedText}
                onChangeText={(text: string) => setEditedText(text)}
                onSubmitEditing={handleKeyboardSubmit}
                initialText={initialTPPNickname}
              />
            ) : (
              <FlexActivityIndicator />
            )}
          </View>
        </View>
        <Stack direction="vertical" style={containerStyle} gap="16p">
          {consetntDetailed.Accounts
            ? consetntDetailed.Accounts.map((account: { Id: string; MaskedNumber: string; Type: string }) => (
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
          {consetntDetailed.Cards
            ? consetntDetailed.Cards.map((card: { AccountNumber: string; MaskedNumber: string; Type: string }) => (
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
          {consetntDetailed.DataGroupsList
            ? consetntDetailed.DataGroupsList.map((item, index) => (
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
            {consetntDetailed.CreationDateTime
              ? format(parseISO(consetntDetailed.CreationDateTime), "dd/MM/yyyy")
              : "dd/MM/yyyy"}
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" style={containerStyle}>
          <Typography.Text color="neutralBase+30" size="callout" weight="medium">
            {t("Settings.ConsentDetailedScreen.expiryDate")}
          </Typography.Text>
          <Typography.Text size="footnote" weight="regular" color="neutralBase+10">
            {consetntDetailed.ExpirationDateTime
              ? isAfter(parseISO(consetntDetailed.ExpirationDateTime), new Date())
                ? t("Settings.ConsentDetailedScreen.ongoing")
                : format(parseISO(consetntDetailed.ExpirationDateTime), "dd/MM/yyyy")
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
  spacingStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
