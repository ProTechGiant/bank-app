import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, SafeAreaView, useWindowDimensions, ViewStyle } from "react-native";

import { FilterIcon, InfoCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import InfoModal from "@/components/InfoModal";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";

import { AccessCustomDateStatementList, AccessMonthlyStatementsList, LanguageFilterModal } from "../components";
import {
  CUSTOM_DATE_STATEMENT_LIMIT,
  MONTHLY_STATEMENT_LIMIT,
  PAGE_OFFSET,
  StatementLanguageTypes,
  StatementStatus,
  StatementTypes,
} from "../constants";
import { useStatementContext } from "../contexts/StatementContext";
import { useGetCustomerStatements, useRetryFailedStatement } from "../hooks/query-hooks";
import { StatementsStackParamsNavigationProp } from "../StatementsStack";
import { PaginationInterface, StatementInterface } from "../types";

export default function AccessStatementScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<StatementsStackParamsNavigationProp>();
  const { height: screenHeight } = useWindowDimensions();
  const { setCorrelationId } = useStatementContext();

  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<StatementTypes>(StatementTypes.MONTHLY);
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
  } = useGetCustomerStatements(pagination, currentTab);

  const retryFailedStatement = useRetryFailedStatement();

  useEffect(() => {
    setCorrelationId(generateRandomId());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (undefined === statementsData && !statementsLoading) {
      refetchStatementData();
      return; // Exit early to prevent the rest of the useEffect code from executing
    }

    if (pagination.offset > 0) {
      setStatements(prev => [...prev, ...(statementsData?.Statements || [])]);
    } else {
      setStatements(statementsData?.Statements || []);
    }
  }, [pagination, refetchStatementData, statementsData, statementsLoading]);

  const handleOnFilter = (language: StatementLanguageTypes) => {
    setActiveFilter(language);
    setIsFilterModalVisible(false);
  };

  useEffect(() => {
    const moreThanThreePendingStatements =
      statements.filter(statement => statement.Status === StatementStatus.PENDING).length > 3;

    const hasNewGeneratedStatement = statements.some(statement => statement.Status === StatementStatus.GENERATED);

    setIsMoreThanThreePendingStatements(moreThanThreePendingStatements);
    setHasNewStatement(hasNewGeneratedStatement);
  }, [statements]);

  const handleOnFetchMoreStatements = () => {
    if (statementsData?.count === statements.length || !statements.length) return;
    setPagination({ ...pagination, offset: pagination.offset + 1 });
  };

  const handleOnRetry = async (documentId: string) => {
    try {
      await retryFailedStatement.mutateAsync(documentId);
      await refetchStatementData();
    } catch (err) {
      warn("Retry Api:", `Error while retrying statement ${documentId + " " + err}`);
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

  const filteredData = useMemo(() => {
    let statementsCopy = [...statements];
    if (activeFilter) {
      statementsCopy = statements.filter(statement => statement.StatementLanguage === activeFilter);
    }
    return statementsCopy;
  }, [activeFilter, statements]);

  const segmentedControlStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
    marginTop: theme.spacing["24p"],
    flexDirection: "row",
  }));

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["supportBase-15"],
  }));

  const mainContainer = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    position: "relative",
    height: screenHeight * 0.87,
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    bottom: 0,
    position: "absolute",
    width: "100%",
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
    <Page>
      <Stack style={headerStyle} align="stretch" direction="vertical">
        <NavHeader title={t("Statements.AccessStatements.title")} />
      </Stack>
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
            statements={filteredData}
            activeFilter={activeFilter}
            onClearFilter={() => setActiveFilter(null)}
            onRefresh={handleOnRefreshStatements}
            isLoading={statementsLoading}
          />
        ) : currentTab === StatementTypes.CUSTOM ? (
          <AccessCustomDateStatementList
            onPressCard={handleOnPressStatement}
            statements={filteredData}
            onRetry={handleOnRetry}
            activeFilter={activeFilter}
            onInfoIcon={handleInfoModal}
            onEndReached={handleOnFetchMoreStatements}
            onClearFilter={() => setActiveFilter(null)}
            onRefresh={handleOnRefreshStatements}
            isLoading={statementsLoading}
          />
        ) : null}
        <LanguageFilterModal
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
      <InfoModal
        isVisible={isInfoModalVisible}
        onClose={handleInfoModal}
        title={t("Statements.AccessStatements.InfoModal.title")}
        description={t("Statements.AccessStatements.InfoModal.description")}
      />
    </Page>
  );
}
