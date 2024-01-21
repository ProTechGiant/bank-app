import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { addDays, formatISO } from "date-fns";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";
import ReactNativeBlobUtil from "react-native-blob-util";
import DocumentPicker from "react-native-document-picker";

import { CloseIcon, FilterIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import CustomStatusBar from "@/components/CustomStatusBar/CustomStatusBar";
import FullScreenLoader from "@/components/FullScreenLoader";
import InfoModal from "@/components/InfoModal";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";
import { requestStorageAndroidPermission } from "@/utils/request-storage-permission.android";

import { DocumentsListComponent } from "../components";
import ViewFilterModal from "../components/ViewFilterModal";
import { DocumentCategory, DocumentStatus, FILTER_DEFAULT_VALUES } from "../constants";
import { DocumentParamsNavigationProp, DocumentsStackParams } from "../DocumentsStack";
import { useGetDocuments, useRetryAdHocDocument } from "../hooks/query-hooks";
import {
  DOCUMENT_LIMIT,
  DOCUMENT_OFFSET,
  DocumentInterface,
  DocumentsFilterInterface,
  DownloadDocumentResponse,
  PaginationInterface,
} from "../types";

export default function DocumentsScreen() {
  const navigation = useNavigation<DocumentParamsNavigationProp>();
  const { height: screenHeight } = useWindowDimensions();
  const [pagination, setPagination] = useState<PaginationInterface>({ limit: 10, offset: 0 });
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState<boolean>(false);
  const [documents, setDocuments] = useState<DocumentInterface[]>([]);
  const [taxInvoices, setTaxInvoices] = useState<DocumentInterface[]>([]);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState<boolean>(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
  const [retryLoadingStates, setRetryLoadingStates] = useState<boolean[]>([]);
  const [showDownloadDocumentModal, setShowDownloadDocumentModal] = useState(false);
  const route = useRoute<RouteProp<DocumentsStackParams, "Documents.DocumentsScreen">>();

  useEffect(() => {
    if (undefined === route.params) return;
    const newTaxInvoiceDocument: DocumentInterface = {
      DocumentId: generateRandomId(),
      AdhocDocRequestId: generateRandomId(),
      Status: DocumentStatus.Approved,
      Category: DocumentCategory["Consolidated Tax Invoice"],
      CreateDateTime: formatISO(new Date()),
      DocumentStatusUpdateDateTime: undefined,
      ExpiryDateTime: formatISO(addDays(new Date(), 1)),
      DocumentLanguage: "EN",
      DownloadedDocument: { ...route.params },
    };

    setTaxInvoices(oldInvoices => [{ ...newTaxInvoiceDocument }, ...oldInvoices]);
  }, [route.params]);

  const mappedFilters = {
    documentType: FILTER_DEFAULT_VALUES.documentType,
    language: FILTER_DEFAULT_VALUES.language,
    status: FILTER_DEFAULT_VALUES.status,
  };
  const [documentFilters, setDocumentFilters] = useState<DocumentsFilterInterface | null>(mappedFilters);
  const [selectedFilters, setSelectedFilters] = useState<{
    documentType: string[];
    language: string[];
    status: string[];
  }>({
    documentType: [],
    language: [],
    status: [],
  });

  const [selectedFiltersLabels, setSelectedFiltersLabels] = useState([
    ...selectedFilters.documentType,
    ...selectedFilters.language,
    ...selectedFilters.status,
  ]);

  const { mutateAsync: retryFailedAdHocDocument } = useRetryAdHocDocument();

  const {
    data: documentsData,
    refetch: refetchDocumentData,
    isLoading,
  } = useGetDocuments(pagination, documentFilters ?? FILTER_DEFAULT_VALUES);

  useEffect(() => {
    navigation.addListener("focus", () => refetchDocumentData());
  }, [navigation]);

  const handleApplyFilter = (filters: { documentType: string[]; language: string[]; status: string[] }) => {
    setSelectedFilters(filters);
    setIsFilterModalVisible(false);
  };

  const removeFilter = (filterType: string) => {
    setSelectedFilters(prevFilters => {
      const updatedFilters = {
        documentType: prevFilters.documentType.filter(type => type !== filterType),
        language: prevFilters.language.filter(type => type !== filterType),
        status: prevFilters.status.filter(type => type !== filterType),
      };

      return updatedFilters;
    });
  };

  const filterMappings: {
    documentType: { [key: string]: string };
    language: { [key: string]: string };
    status: { [key: string]: string };
  } = {
    documentType: {
      "IBAN Letter": "01",
      "Bank Certificate": "02",
    },
    language: {
      English: "EN",
      العربية: "AR",
    },
    status: {
      Pending: "01",
      Approved: "02",
      Downloaded: "03",
      Failed: "04",
    },
  };

  const filteredDocuments = documents.filter(document => {
    const isCategoryMatch =
      documentFilters?.documentType === "" || documentFilters?.documentType.includes(document.Category);
    const isLanguageMatch =
      documentFilters?.language === "" || documentFilters?.language.includes(document.DocumentLanguage);
    const isStatusMatch = documentFilters?.status === "" || documentFilters?.status.includes(document.Status);

    return isCategoryMatch && isLanguageMatch && isStatusMatch;
  });

  useEffect(() => {
    const categoryParam =
      selectedFilters.documentType.length > 0
        ? selectedFilters.documentType.map(option => filterMappings.documentType[option]).join(",")
        : "";
    const languageParam =
      selectedFilters.language.length > 0
        ? selectedFilters.language.map(option => filterMappings.language[option]).join(",")
        : "";
    const statusParam =
      selectedFilters.status.length > 0
        ? selectedFilters.status
            .map(option => {
              if (option === "Approved") {
                return [filterMappings.status.Approved, filterMappings.status.Downloaded];
              }
              return filterMappings.status[option];
            })
            .join(",")
        : "";
    setDocumentFilters({
      documentType: categoryParam || FILTER_DEFAULT_VALUES.documentType,
      language: languageParam || FILTER_DEFAULT_VALUES.language,
      status: statusParam || FILTER_DEFAULT_VALUES.status,
    });

    setSelectedFiltersLabels([...selectedFilters.documentType, ...selectedFilters.language, ...selectedFilters.status]);
  }, [selectedFilters]);

  useEffect(() => {
    if (pagination.offset > 0) {
      setDocuments(prev => [...prev, ...(documentsData?.Documents || [])]);
    } else {
      setDocuments(documentsData?.Documents || []);
    }
  }, [pagination, documentsData, documentFilters]);

  const handleOnEndReached = () => {
    if (documentsData?.TotalRecords === documents.length) return;
    setPagination({ ...pagination, offset: pagination.offset + 1 });
  };

  const handleOnRefresh = () => {
    setPagination({ limit: DOCUMENT_LIMIT, offset: DOCUMENT_OFFSET });
    refetchDocumentData();
  };

  useEffect(() => {
    if (documentsData?.Documents?.length) {
      const retryStates = new Array(documentsData.Documents.length).fill(false);
      setRetryLoadingStates(retryStates);
    }
  }, [documentsData]);

  const saveZipFile = async (downloadedContent: DownloadDocumentResponse) => {
    const dirs = ReactNativeBlobUtil.fs.dirs;
    const path = Platform.OS === "android" ? dirs.LegacyDownloadDir : dirs.DocumentDir;
    const filePath = `${path}/${downloadedContent.DocumentName}`;
    const regex = /^data:image\/jpeg;base64,/;
    try {
      if (Platform.OS === "android" && !(await requestStorageAndroidPermission())) return;
      await ReactNativeBlobUtil.fs.writeFile(
        filePath,
        downloadedContent.DocumentContent.replace(regex, "").replace(/\r?\n|\r/g, ""),
        "base64"
      );
      if (Platform.OS === "ios") {
        await ReactNativeBlobUtil.ios.openDocument(filePath);
      } else setShowDownloadDocumentModal(true);
    } catch (error) {}
  };

  const handleOnPressCard = (documentId: string, downloadedDocument: undefined | DownloadDocumentResponse) => {
    if (downloadedDocument) {
      saveZipFile(downloadedDocument);
    } else {
      navigation.navigate("Documents.PreviewDocumentScreen", { documentId });
    }
  };

  const openFileManager = async () => {
    try {
      await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the document picker
      } else {
        warn("Error picking document", err);
      }
    }
  };

  const updateFailedDocumentStatus = async (requestId: string, index: number) => {
    const updatedIsRetryLoading = [...retryLoadingStates];
    updatedIsRetryLoading[index] = true;
    setRetryLoadingStates(updatedIsRetryLoading);

    try {
      await retryFailedAdHocDocument(requestId);
    } catch (error) {
      warn("Retry failed:", JSON.stringify(error));
      setIsNotificationModalVisible(true);
    } finally {
      updatedIsRetryLoading[index] = false;
      setRetryLoadingStates(updatedIsRetryLoading);
    }
  };

  const handleOnRetry = async (requestId: string, index: number) => {
    try {
      await updateFailedDocumentStatus(requestId, index);
      await refetchDocumentData();
    } catch (err) {
      warn("Retry Api:", `Error while retrying statement ${requestId + " " + err}`);
      setIsNotificationModalVisible(true);
    }
  };

  const handleOnPressButton = () => {
    navigation.navigate("Documents.RequestDocumentScreen");
  };

  const handleOnToggleInfoModal = () => {
    setIsInfoModalVisible(!isInfoModalVisible);
  };

  const iconWrapperStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: "auto",
    marginRight: theme.spacing["20p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    bottom: 0,
    position: "absolute",
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: screenHeight * 0.03,
  }));

  const filterContainerStyle = useThemeStyles(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    backgroundColor: theme.palette["neutralBase-40"],
    marginTop: theme.spacing["24p"],
  }));

  const optionContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.xxlarge,
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["4p"],
    marginHorizontal: theme.spacing["4p"],
    borderWidth: 2,
    borderColor: theme.palette.primaryBase,
    justifyContent: "space-between",
  }));

  const filterSpacingStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: theme.spacing["8p"],
  }));

  const redCircleStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    width: 8,
    height: 8,
    flexDirection: "row-reverse",
    borderRadius: theme.radii.extraSmall,
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-40"],
    backgroundColor: theme.palette.complimentBase,
    right: -0,
  }));

  const navHeaderStyle = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);

  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);
  return (
    <Page insets={["left", "right"]}>
      <CustomStatusBar barStyle="light-content" backgroundColor={NavHeaderColor} />
      <NavHeader
        hasBackButtonIconBackground={false}
        variant="angled"
        backgroundAngledColor={navHeaderStyle}
        title={t("Documents.DocumentListScreen.title")}
        end={
          <Pressable onPress={() => setIsFilterModalVisible(true)} style={iconWrapperStyle}>
            <FilterIcon color={iconColor} />
            {selectedFiltersLabels.length > 0 && <View style={redCircleStyle} />}
          </Pressable>
        }
      />
      {isLoading ? (
        <View style={styles.loading}>
          <FullScreenLoader />
        </View>
      ) : (
        <>
          {selectedFiltersLabels.length > 0 ? (
            <Stack direction="horizontal" align="center" style={filterContainerStyle}>
              <Typography.Text color="neutralBase" size="footnote" weight="regular">
                {t("Documents.DocumentListScreen.filteredBy")}
              </Typography.Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {selectedFiltersLabels.map(type => (
                  <Pressable onPress={() => removeFilter(type)} style={optionContainerStyle}>
                    <Typography.Text color="neutralBase+30" size="footnote" weight="medium">
                      {type}
                    </Typography.Text>
                    <View style={filterSpacingStyle}>
                      <CloseIcon width={14} height={18} />
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </Stack>
          ) : null}
          <ContentContainer style={styles.contentContainer}>
            <DocumentsListComponent
              onEndReached={handleOnEndReached}
              onRefresh={handleOnRefresh}
              isLoading={false}
              onPressCard={handleOnPressCard}
              onRetry={handleOnRetry}
              onInfoIcon={handleOnToggleInfoModal}
              documents={[...taxInvoices, ...filteredDocuments]}
              isRetryLoading={retryLoadingStates}
              isFilterActive={selectedFiltersLabels?.length > 0 || false}
            />
          </ContentContainer>
          <Stack style={buttonContainerStyle} align="stretch" direction="vertical">
            <Button onPress={handleOnPressButton}>{t("Documents.DocumentListScreen.requestDocumentButtonText")}</Button>
          </Stack>
        </>
      )}
      <InfoModal
        isVisible={isInfoModalVisible}
        onClose={handleOnToggleInfoModal}
        title={t("Documents.DocumentListScreen.InfoModal.title")}
        description={t("Documents.DocumentListScreen.InfoModal.description")}
      />
      <ViewFilterModal
        visible={isFilterModalVisible}
        selectedCategory={selectedFilters.documentType}
        selectedLanguage={selectedFilters.language}
        selectedStatus={selectedFilters.status}
        onClose={() => setIsFilterModalVisible(false)}
        onApplyFilter={handleApplyFilter}
      />

      <NotificationModal
        isVisible={isNotificationModalVisible}
        message={t("Documents.RequestDocumentScreen.pleaseTryAgain")}
        onClose={() => setIsNotificationModalVisible(false)}
        title={t("Documents.RequestDocumentScreen.somethingWentWrong")}
        variant="error"
      />

      {/* This Notification Modal is only for android */}
      <NotificationModal
        variant="success"
        title={t("PreviewPDF.downloadSuccessfully")}
        onClose={() => setShowDownloadDocumentModal(false)}
        isVisible={showDownloadDocumentModal}
        buttons={{
          primary: (
            <Button
              onPress={async () => {
                setShowDownloadDocumentModal(false);
                openFileManager();
              }}
              testID="PreviewPDF:NotificationViewFileButton">
              {t("PreviewPDF.viewFile")}
            </Button>
          ),
          secondary: (
            <Button onPress={() => setShowDownloadDocumentModal(false)} testID="PreviewPDF:NotificationCloseButton">
              {t("PreviewPDF.errorCancelText")}
            </Button>
          ),
        }}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 100,
  },
  loading: {
    flex: 1,
    marginTop: -49,
  },
});
