import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, SafeAreaView, useWindowDimensions, ViewStyle } from "react-native";

import { FilterIcon, InfoCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import InfoModal from "@/components/InfoModal";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import { useThemeStyles } from "@/theme";

import { AccessCustomDateStatementList, AccessMonthlyStatementsList, LanguageFilterModal } from "../components";
import {
  CUSTOM_DATE_STATEMENT_LIMIT,
  MONTHLY_STATEMENT_LIMIT,
  PAGE_OFFSET,
  StatementLanguageTypes,
  StatementStatus,
  StatementTypes,
} from "../constants";
import { useGetCustomerStatements, useRetryFailedStatement } from "../hooks/query-hooks";
import { StatementsStackParamsNavigationProp } from "../StatementsStack";
import { PaginationInterface, StatementInterface } from "../types";

export default function AccessStatementScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<StatementsStackParamsNavigationProp>();
  const { height: screenHeight } = useWindowDimensions();
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState<boolean>(false);

  const [preferredLanguage, setPreferredLanguage] = useState<StatementLanguageTypes>(
    i18n.language.toUpperCase() as StatementLanguageTypes
  );
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);

  const route = useRoute<RouteProp<AuthenticatedStackParams, "Statements.AccessStatementScreen">>();
  const [currentTab, setCurrentTab] = useState<StatementTypes>(
    route?.params?.type === StatementTypes.CUSTOM ? StatementTypes.CUSTOM : StatementTypes.MONTHLY
  );
  const [pagination, setPagination] = useState<PaginationInterface>({
    limit: MONTHLY_STATEMENT_LIMIT,
    offset: PAGE_OFFSET,
  });
  const [isInfoModalVisible, setIsInfoModalVisible] = useState<boolean>(false);
  const [isMoreThanThreePendingStatements, setIsMoreThanThreePendingStatements] = useState<boolean>(false);
  const [hasNewStatement, setHasNewStatement] = useState<boolean>(false);

  const [activeFilter, setActiveFilter] = useState<StatementLanguageTypes | null>(null);
  const [statements, setStatements] = useState<StatementInterface[]>([]);

  const {
    data: statementsData,
    isLoading: statementsLoading,
    refetch: refetchStatementData,
  } = useGetCustomerStatements(pagination, currentTab, activeFilter);

  const [retryLoadingStates, setRetryLoadingStates] = useState<boolean[]>(
    new Array(statementsData?.TotalRecords).fill(false)
  );

  const { mutateAsync: retryFailedStatement } = useRetryFailedStatement();

  useEffect(() => {
    navigation.addListener("focus", () => {
      if (route.params?.type) {
        setCurrentTab(route.params.type);
      }
      handleOnRefreshStatements();
    });
  }, [navigation, route.params?.type]);

  useEffect(() => {
    if (pagination.offset > 0) {
      setStatements(prev => [...prev, ...(statementsData?.Statements || [])]);
    } else {
      setStatements(statementsData?.Statements || []);
    }
  }, [pagination, statementsData]);

  const handleOnFilter = (language: StatementLanguageTypes) => {
    setActiveFilter(language);
    setIsFilterModalVisible(false);
  };

  const handleRetryClick = async (requestId: string, index: number) => {
    const isLoading = true;
    const updatedIsRetryLoading = [...retryLoadingStates];
    updatedIsRetryLoading[index] = isLoading;
    setRetryLoadingStates(updatedIsRetryLoading);

    try {
      await retryFailedStatement(requestId);
    } catch (error) {
      warn("Retry failed:", JSON.stringify(error));
      setIsNotificationModalVisible(true);
    } finally {
      updatedIsRetryLoading[index] = false;
      setRetryLoadingStates(updatedIsRetryLoading);
    }
  };

  useEffect(() => {
    const moreThanThreePendingStatements =
      statements.filter(statement => statement.Status === StatementStatus.PENDING).length >= 3;
    const hasNewGeneratedStatement = statements.some(statement => statement.Status === StatementStatus.GENERATED);
    setIsMoreThanThreePendingStatements(moreThanThreePendingStatements);
    setHasNewStatement(hasNewGeneratedStatement);
  }, [statements]);

  const handleOnFetchMoreStatements = () => {
    if (statementsData?.TotalRecords === statements.length) return;
    setPagination({ ...pagination, offset: pagination.offset + 1 });
  };

  const handleOnRetry = async (requestId: string, index: number) => {
    try {
      await handleRetryClick(requestId, index);
      await refetchStatementData();
    } catch (err) {
      warn("Retry Api:", `Error while retrying statement ${requestId + " " + err}`);
      setIsNotificationModalVisible(true);
    }
  };

  const handleOnPressStatement = (documentId: string) => {
    navigation.navigate("Statements.PreviewStatementScreen", { documentId });
  };

  const handleOnTabChange = (tab: StatementTypes) => {
    if (tab === currentTab) return;
    setStatements([]);

    if (tab === StatementTypes.MONTHLY) {
      setPagination({ limit: MONTHLY_STATEMENT_LIMIT, offset: PAGE_OFFSET });
    } else if (tab === StatementTypes.CUSTOM) {
      setPagination({ limit: CUSTOM_DATE_STATEMENT_LIMIT, offset: PAGE_OFFSET });
    }
    setCurrentTab(tab);
  };

  const handleOnRefreshStatements = async () => {
    if (currentTab === StatementTypes.MONTHLY) {
      setPagination({ limit: MONTHLY_STATEMENT_LIMIT, offset: PAGE_OFFSET });
    } else if (currentTab === StatementTypes.CUSTOM) {
      setPagination({ limit: CUSTOM_DATE_STATEMENT_LIMIT, offset: PAGE_OFFSET });
    }
    refetchStatementData();
  };

  const handleInfoModal = () => {
    setIsInfoModalVisible(!isInfoModalVisible);
  };

  const handleOnRequestStatement = () => {
    navigation.navigate("Statements.RequestStatementScreen");
  };

  const handleOnChangePreferredLanguage = (language: StatementLanguageTypes) => {
    setPreferredLanguage(language);
  };

  const handleOnClearFilter = () => {
    setActiveFilter(null);
    setPreferredLanguage(i18n.language.toUpperCase() as StatementLanguageTypes);
  };

  const segmentedControlStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
    marginTop: theme.spacing["48p"],
    flexDirection: "row",
  }));

  const mainContainer = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    position: "relative",
    height: screenHeight * 0.87,
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    bottom: 0,
    position: "absolute",
    width: "95%",
    alignSelf: "center",
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: screenHeight * 0.03,
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const iconWraperStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: "auto",
    marginRight: theme.spacing["20p"],
  }));

  const infoTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  const infoIconColor = useThemeStyles(theme => theme.palette.neutralBase);

  return (
    <Page insets={["left", "right"]}>
      <NavHeader variant="angled" title={t("Statements.AccessStatements.title")} />
      <SafeAreaView style={mainContainer}>
        <Stack style={segmentedControlStyle} direction="horizontal">
          <SegmentedControl onPress={value => handleOnTabChange(value)} value={currentTab}>
            <SegmentedControl.Item
              hasUpdate={currentTab === StatementTypes.MONTHLY && hasNewStatement}
              value={StatementTypes.MONTHLY}>
              {t("Statements.AccessStatements.monthly")}
            </SegmentedControl.Item>
            <SegmentedControl.Item
              hasUpdate={currentTab === StatementTypes.CUSTOM && hasNewStatement}
              value={StatementTypes.CUSTOM}>
              {t("Statements.AccessStatements.customDate")}
            </SegmentedControl.Item>
          </SegmentedControl>
          <Pressable onPress={() => setIsFilterModalVisible(true)} style={iconWraperStyle}>
            <FilterIcon />
          </Pressable>
        </Stack>
        {currentTab === StatementTypes.MONTHLY ? (
          <AccessMonthlyStatementsList
            onPressCard={handleOnPressStatement}
            statements={statements}
            activeFilter={activeFilter}
            onClearFilter={handleOnClearFilter}
            onRefresh={handleOnRefreshStatements}
            isLoading={statementsLoading}
          />
        ) : currentTab === StatementTypes.CUSTOM ? (
          <AccessCustomDateStatementList
            onPressCard={handleOnPressStatement}
            statements={statements}
            onRetry={handleOnRetry}
            isRetryLoading={retryLoadingStates}
            activeFilter={activeFilter}
            onInfoIcon={handleInfoModal}
            onEndReached={handleOnFetchMoreStatements}
            onClearFilter={handleOnClearFilter}
            onRefresh={handleOnRefreshStatements}
            isLoading={statementsLoading}
          />
        ) : null}
        <LanguageFilterModal
          preferredLanguage={preferredLanguage}
          onChangePreferredLanguage={handleOnChangePreferredLanguage}
          isVisible={isFilterModalVisible}
          onClose={() => setIsFilterModalVisible(false)}
          onFilter={handleOnFilter}
        />
      </SafeAreaView>
      <Stack style={buttonContainerStyle} align="stretch" direction="vertical">
        <Button disabled={isMoreThanThreePendingStatements} onPress={handleOnRequestStatement}>
          {t("Statements.AccessStatements.requestStatementButtonText")}
        </Button>
        {currentTab === StatementTypes.CUSTOM && isMoreThanThreePendingStatements && (
          <Stack direction="horizontal" align="center" justify="center" gap="4p" style={infoTextStyle}>
            <InfoCircleIcon color={infoIconColor} />
            <Typography.Text size="caption1" weight="regular" color="neutralBase">
              {t("Statements.AccessStatements.pendingRequestLimit")}
            </Typography.Text>
          </Stack>
        )}
      </Stack>
      <NotificationModal
        isVisible={isNotificationModalVisible}
        message={t("Statements.RequestStatementScreen.pleaseTryAgain")}
        onClose={() => setIsNotificationModalVisible(false)}
        title={t("Statements.RequestStatementScreen.weAreSorry")}
        variant="error"
      />
      <InfoModal
        isVisible={isInfoModalVisible}
        onClose={handleInfoModal}
        title={t("Statements.AccessStatements.InfoModal.title")}
        description={t("Statements.AccessStatements.InfoModal.description")}
      />
    </Page>
  );
}
