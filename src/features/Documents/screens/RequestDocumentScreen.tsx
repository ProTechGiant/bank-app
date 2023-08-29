import { format } from "date-fns";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { InfoCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";

import {
  SelectDateModal,
  SelectDocumentDateSection,
  SelectDocumentTypeSection,
  SelectLanguageSection,
} from "../components";
import { DocumentCategory, DocumentLanguageType, DocumentStatus, DocumentType } from "../constants";
import { useGetCustomerOnboardingDate } from "../hooks/query-hooks";

// TODO: will replace from api
const isCreateCustomDocumentApiLoading = false;

export default function RequestDocumentScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  const [documentLanguage, setDocumentLanguage] = useState<DocumentLanguageType>(
    i18n.language.toUpperCase() as DocumentLanguageType
  );
  const [documentDate, setDocumentDate] = useState<null | string>(null);
  const [documentType, setDocumentType] = useState<null | DocumentType>(null);
  const [isDocumentDateModalVisible, setIsDocumentDateModalVisible] = useState<boolean>(false);
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState<{
    success: boolean;
    error: boolean;
    failure: boolean;
  }>({
    success: false,
    failure: false,
    error: false,
  });

  const { data: customerOnboardingDate } = useGetCustomerOnboardingDate();

  const handleOnPressRequestDocument = async () => {
    // TODO: Later will call api here
    setIsNotificationModalVisible({ success: true, error: false, failure: false });
  };

  const handleOnCloseNotificationModal = () => {
    setIsNotificationModalVisible({ success: false, error: false, failure: false });
    // TODO: Later will remove this mock data
    navigation.navigate("Documents.DocumentsScreen", {
      doc: {
        DocumentId: generateRandomId().toString(),
        AdhocDocRequestId: generateRandomId().toString(),
        Status: DocumentStatus.PENDING,
        Category:
          documentType === DocumentType.IBAN_LETTER ? DocumentCategory.IBAN_LETTER : DocumentCategory.BANK_CERTIFICATE,
        ExpiryDate: "2024-12-31",
        CreateDateTime: format(new Date(), "yyyy-MM-dd"),
        DocumentStatusUpdateDateTime: format(new Date(), "dd-MM-yyyy hh:mm:ss a"),
        DocumentLanguage: documentLanguage,
      },
    });
  };

  const sectionBreakerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    backgroundColor: theme.palette["neutralBase-40"],
    height: 4,
  }));

  const bottomSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    marginBottom: theme.spacing["16p"],
  }));

  const infoIconColor = useThemeStyles(theme => theme.palette.neutralBase);

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={t("Documents.RequestDocumentScreen.title")}
          withBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <Stack direction="vertical" align="stretch" justify="space-between" flex={1}>
          <ScrollView contentContainerStyle={styles.scrollViewStyle}>
            <SelectDocumentTypeSection selectedDocumentType={documentType} onSelectDocumentType={setDocumentType} />
            {documentType ? (
              <>
                <View style={sectionBreakerStyle} />
                <SelectLanguageSection documentLanguage={documentLanguage} onChangeLanguage={setDocumentLanguage} />
              </>
            ) : null}
            {documentType && documentType === DocumentType.BANK_CERTIFICATE ? (
              <>
                <View style={sectionBreakerStyle} />
                <SelectDocumentDateSection
                  documentDate={documentDate}
                  onPressSetDate={() => setIsDocumentDateModalVisible(true)}
                />
              </>
            ) : null}
          </ScrollView>

          <Stack direction="vertical" style={bottomSectionStyle} align="stretch" gap="8p">
            <Button
              loading={isCreateCustomDocumentApiLoading}
              onPress={handleOnPressRequestDocument}
              disabled={documentType !== DocumentType.IBAN_LETTER && !documentDate}>
              {t("Documents.RequestDocumentScreen.buttonTitle")}
            </Button>
            <Stack direction="horizontal" align="center" justify="center" gap="4p">
              <InfoCircleIcon color={infoIconColor} />
              <Typography.Text size="caption1" weight="regular" color="neutralBase">
                {t("Documents.RequestDocumentScreen.buttonTitleDesc")}
              </Typography.Text>
            </Stack>
          </Stack>
        </Stack>

        <NotificationModal
          isVisible={isNotificationModalVisible.failure}
          title={t("Documents.RequestDocumentScreen.documentRequestRejected")}
          onClose={handleOnCloseNotificationModal}
          message={t("Documents.RequestDocumentScreen.youHaveAnotherPendingRequest")}
          variant="error"
        />
        <NotificationModal
          isVisible={isNotificationModalVisible.error}
          title={t("Documents.RequestDocumentScreen.somethingWentWrong")}
          onClose={handleOnCloseNotificationModal}
          message={t("Documents.RequestDocumentScreen.pleaseTryAgain")}
          variant="error"
        />
        <NotificationModal
          buttons={{
            primary: (
              <Button onPress={handleOnCloseNotificationModal}>{t("Documents.RequestDocumentScreen.goBack")}</Button>
            ),
          }}
          isVisible={isNotificationModalVisible.success}
          title={t("Documents.RequestDocumentScreen.yourDocumentRequestSuccessfullySent")}
          message={t("Documents.RequestDocumentScreen.normallyTakesUptoOneBusinessDay")}
          variant="success"
        />
        <Modal
          headerText={t("Documents.RequestDocumentScreen.selectDate")}
          visible={isDocumentDateModalVisible}
          onClose={() => setIsDocumentDateModalVisible(false)}>
          <SelectDateModal
            selectedDate={documentDate}
            onPickDate={date => {
              setDocumentDate(date);
              setIsDocumentDateModalVisible(false);
            }}
            onboardingDate={customerOnboardingDate?.OnboardingDate}
          />
        </Modal>
      </Page>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollViewStyle: { paddingBottom: 40 },
});
