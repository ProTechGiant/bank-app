import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, ViewStyle } from "react-native";
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

import { SelectDateModal, SelectDocumentDateSection, SelectLanguageSection } from "../components";
import { DocumentCategory, DocumentLanguageType, DocumentType } from "../constants";
import { DocumentsStackParams } from "../DocumentsStack";
import { useGetCustomerOnboardingDate, useGetTaxInvoices, useRequestAdHocDocument } from "../hooks/query-hooks";

function convertToYYMM(year: number, month: number) {
  const lastTwoYearDigits = String(year).slice(-2);
  const formattedMonth = String(month + 1).padStart(2, "0");
  return `${lastTwoYearDigits}${formattedMonth}`;
}

export default function RequestDocumentTypeScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  const route = useRoute<RouteProp<DocumentsStackParams, "Documents.RequestDocumentTypeScreen">>();
  const { documentType } = route.params;

  const [documentLanguage, setDocumentLanguage] = useState<DocumentLanguageType>(
    i18n.language.toUpperCase() as DocumentLanguageType
  );
  const [documentDate, setDocumentDate] = useState<null | string>(null);
  const [taxInvoiceMonthYear, setTaxInvoiceMonthYear] = useState<null | { year: number; month: number }>(null);
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
  const { data: taxInvoice, refetch: fetchTaxInvoice } = useGetTaxInvoices(
    taxInvoiceMonthYear ? convertToYYMM(taxInvoiceMonthYear.year, taxInvoiceMonthYear.month) : undefined
  );
  const [isCallingTaxApi, setIsCallingTaxApi] = useState<boolean>(false);
  const [fetchTaxError, setFetchTaxError] = useState<boolean>(false);
  const requestAdhocDocument = useRequestAdHocDocument();

  const handleOnPressRequestDocument = async () => {
    try {
      if (documentType === DocumentType.CONSOLIDATED_TAX_INVOICE && taxInvoiceMonthYear) {
        setIsCallingTaxApi(true);
        const response = await fetchTaxInvoice();
        if (response.data) {
          setIsNotificationModalVisible({ success: true, error: false, failure: false });
        } else setFetchTaxError(true);
        setIsCallingTaxApi(false);
        return;
      }
      if (customerOnboardingDate?.OnboardingDate && documentLanguage) {
        const documentData = {
          ...(documentDate ? { BankCertificateDate: documentDate } : null),
          Certified: true,
          Language: documentLanguage,
          OnboardingDate: customerOnboardingDate?.OnboardingDate,
          DocumentCategory:
            documentType === DocumentType.IBAN_LETTER
              ? DocumentCategory["IBAN Letter"]
              : DocumentCategory["Bank Certificate"],
        };

        await requestAdhocDocument.mutateAsync(documentData);
        setIsNotificationModalVisible({ success: true, error: false, failure: false });
      } else {
        setIsNotificationModalVisible({ success: false, error: true, failure: false });
      }
    } catch (err) {
      const errorId = err?.errorContent?.Errors[0]?.ErrorId;
      //ErrorId = 0003, Old request with same data exists in pending status.
      if (errorId === "0003") {
        setIsNotificationModalVisible({ success: false, error: false, failure: true });
      } else {
        setIsNotificationModalVisible({ success: false, error: true, failure: false });
      }
      if (isCallingTaxApi) setFetchTaxError(true);
      setIsCallingTaxApi(false);
    }
  };

  const handleOnCloseNotificationModal = () => {
    if (fetchTaxError) {
      setFetchTaxError(false);
      return;
    }
    setIsNotificationModalVisible({ success: false, error: false, failure: false });
    if (documentType === DocumentType.CONSOLIDATED_TAX_INVOICE && taxInvoice) {
      navigation.navigate("Documents.DocumentsScreen", { ...taxInvoice });
    } else {
      navigation.navigate("Documents.DocumentsScreen");
    }
  };

  const bottomSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    marginBottom: theme.spacing["16p"],
  }));

  const infoIconColor = useThemeStyles(theme => theme.palette.neutralBase);

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={
            documentType === DocumentType.CONSOLIDATED_TAX_INVOICE
              ? t("Documents.RequestDocumentScreen.taxInvoice")
              : documentType === DocumentType.BANK_CERTIFICATE
              ? t("Documents.RequestDocumentScreen.bankCertificate")
              : t("Documents.RequestDocumentScreen.ibanLetter")
          }
          withBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <Stack direction="vertical" align="stretch" justify="space-between" flex={1}>
          <ScrollView contentContainerStyle={styles.scrollViewStyle}>
            {documentType !== DocumentType.CONSOLIDATED_TAX_INVOICE ? (
              <SelectLanguageSection documentLanguage={documentLanguage} onChangeLanguage={setDocumentLanguage} />
            ) : null}
            {documentType === DocumentType.BANK_CERTIFICATE ||
            documentType === DocumentType.CONSOLIDATED_TAX_INVOICE ? (
              <SelectDocumentDateSection
                documentDate={documentDate}
                onPressSetDate={() => setIsDocumentDateModalVisible(true)}
                selectingMonthYear={documentType === DocumentType.CONSOLIDATED_TAX_INVOICE}
                monthYear={taxInvoiceMonthYear}
              />
            ) : null}
          </ScrollView>

          <Stack direction="vertical" style={bottomSectionStyle} align="stretch" gap="8p">
            <Button
              loading={requestAdhocDocument.isLoading || isCallingTaxApi}
              onPress={handleOnPressRequestDocument}
              disabled={
                documentType === DocumentType.CONSOLIDATED_TAX_INVOICE
                  ? !taxInvoiceMonthYear
                  : documentType !== DocumentType.IBAN_LETTER && !documentDate
              }>
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
          isVisible={fetchTaxError}
          title={t("Documents.RequestDocumentScreen.taxInvoiceFailedToDownload")}
          onClose={handleOnCloseNotificationModal}
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
            taxInvoiceMonthYear={taxInvoiceMonthYear}
            documentType={documentType}
            selectedDate={documentDate}
            onPickDate={date => {
              setDocumentDate(date);
              setIsDocumentDateModalVisible(false);
            }}
            onboardingDate={customerOnboardingDate?.OnboardingDate}
            setTaxInvoiceMonthYear={(obj: { year: number; month: number }) => {
              setTaxInvoiceMonthYear(obj);
              setIsDocumentDateModalVisible(false);
            }}
          />
        </Modal>
      </Page>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollViewStyle: { paddingBottom: 40 },
});
