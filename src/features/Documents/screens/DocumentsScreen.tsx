import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import { CloseIcon, FilterIcon } from "@/assets/icons";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import { useThemeStyles } from "@/theme";

import Button from "../../../components/Button";
import ContentContainer from "../../../components/ContentContainer";
import InfoModal from "../../../components/InfoModal";
import { DocumentsListComponent } from "../components";
import ViewFilterModal from "../components/ViewFilterModal";
import { DocumentParamsNavigationProp } from "../DocumentsStack";
import { useGetDocuments, useRetryAdHocDocument } from "../hooks/query-hooks";
import { DOCUMENT_LIMIT, DOCUMENT_OFFSET, DocumentInterface, PaginationInterface } from "../types";

export default function DocumentsScreen() {
  const navigation = useNavigation<DocumentParamsNavigationProp>();
  const { mutateAsync: retryFailedAdHocDocument } = useRetryAdHocDocument();

  const [isFilterModalVisible, setIsFiltersModalVisible] = useState<boolean>(false);
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState<boolean>(false);

  const [selectedFilters, setSelectedFilters] = useState<{
    documentType: string[];
    language: string[];
    status: string[];
  }>({
    documentType: [],
    language: [],
    status: [],
  });

  const route = useRoute<RouteProp<AuthenticatedStackParams, "Documents.DocumentsScreen">>();

  useEffect(() => {
    navigation.addListener("focus", () => refetchDocumentData());
  }, [navigation]);

  const handleApplyFilter = (filters: { documentType: string[]; language: string[]; status: string[] }) => {
    setSelectedFilters(filters);
    setIsFilterModalVisible(false);
  };

  const selectedFiltersLabels = [
    ...selectedFilters.documentType,
    ...selectedFilters.language,
    ...selectedFilters.status,
  ];

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

  const { height: screenHeight } = useWindowDimensions();
  const [_isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationInterface>({ limit: 10, offset: 0 });
  const { data: documentsData, refetch: refetchDocumentData } = useGetDocuments(pagination);
  const [documents, setDocuments] = useState<DocumentInterface[]>([]);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState<boolean>(false);

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
      Failed: "04",
    },
  };

  // Create string parameters for filters using filterMappings
  const categoryParam =
    selectedFilters.documentType.length > 0
      ? selectedFilters.documentType.map(option => filterMappings.documentType[option]).join(", ")
      : "";
  const languageParam =
    selectedFilters.language.length > 0
      ? selectedFilters.language.map(option => filterMappings.language[option]).join(", ")
      : "";
  const statusParam =
    selectedFilters.status.length > 0
      ? selectedFilters.status.map(option => filterMappings.status[option]).join(", ")
      : "";

  const filteredDocuments = documents.filter(document => {
    const isCategoryMatch = categoryParam === "" || categoryParam.includes(document.Category);
    const isLanguageMatch = languageParam === "" || languageParam.includes(document.DocumentLanguage);
    const isStatusMatch = statusParam === "" || statusParam.includes(document.Status);

    return isCategoryMatch && isLanguageMatch && isStatusMatch;
  });

  useEffect(() => {
    if (route.params?.doc) {
      setDocuments([route.params?.doc, ...documents]);
    }
  }, [route.params?.doc]);

  useEffect(() => {
    if (pagination.offset > 0) {
      setDocuments(prev => [...prev, ...(documentsData?.Documents || [])]);
    } else {
      setDocuments(documentsData?.Documents || []);
    }
  }, [pagination, documentsData]);

  const handleOnEndReached = () => {
    if (documentsData?.TotalRecords === documents.length) return;
    setPagination({ ...pagination, offset: pagination.offset + 1 });
  };

  const handleOnRefresh = () => {
    setPagination({ limit: DOCUMENT_LIMIT, offset: DOCUMENT_OFFSET });
    refetchDocumentData();
  };

  const handleOnPressCard = (documentId: string) => {
    navigation.navigate("Documents.PreviewDocumentScreen", { documentId });
  };

  const handleOnRetry = async (requestId: string) => {
    try {
      await retryFailedAdHocDocument(requestId);
    } catch (error) {
      warn("Retry failed:", JSON.stringify(error));
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
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: screenHeight * 0.03,
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const filterContainerStyle = useThemeStyles(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["8p"],
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
    marginBottom: theme.spacing["4p"],
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

  return (
    <Page insets={["left", "right"]}>
      <NavHeader
        variant="angled"
        title={t("Documents.DocumentListScreen.title")}
        end={
          <Pressable onPress={() => setIsFiltersModalVisible(true)} style={iconWrapperStyle}>
            <FilterIcon />
            {selectedFiltersLabels.length > 0 && <View style={redCircleStyle} />}
          </Pressable>
        }
      />
      {selectedFiltersLabels.length > 0 ? (
        <Stack direction="horizontal" align="center" style={filterContainerStyle}>
          <Typography.Text color="neutralBase" size="footnote" weight="regular">
            {t("Documents.DocumentListScreen.filteredBy")}
          </Typography.Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedFiltersLabels.map(type => (
              <View style={optionContainerStyle} key={type}>
                <Typography.Text color="neutralBase+30" size="footnote" weight="medium">
                  {type}
                </Typography.Text>
                <Pressable onPress={() => removeFilter(type)} style={filterSpacingStyle}>
                  <CloseIcon width={14} height={18} />
                </Pressable>
              </View>
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
          documents={filteredDocuments}
        />
      </ContentContainer>
      <Stack style={buttonContainerStyle} align="stretch" direction="vertical">
        <Button onPress={handleOnPressButton}>{t("Documents.DocumentListScreen.requestDocumentButtonText")}</Button>
      </Stack>

      <InfoModal
        isVisible={isInfoModalVisible}
        onClose={handleOnToggleInfoModal}
        title={t("Documents.DocumentListScreen.InfoModal.title")}
        description={t("Documents.DocumentListScreen.InfoModal.description")}
      />
      {isFilterModalVisible ? (
        <ViewFilterModal
          visible={isFilterModalVisible}
          onClose={() => setIsFiltersModalVisible(false)}
          onApplyFilter={handleApplyFilter}
        />
      ) : null}
      <NotificationModal
        isVisible={isNotificationModalVisible}
        message={t("Statements.RequestStatementScreen.pleaseTryAgain")}
        onClose={() => setIsNotificationModalVisible(false)}
        title={t("Statements.RequestStatementScreen.weAreSorry")}
        variant="error"
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 100,
  },
});
