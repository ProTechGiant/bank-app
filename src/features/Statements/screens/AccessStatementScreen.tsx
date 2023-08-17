import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, SafeAreaView, useWindowDimensions, ViewStyle } from "react-native";

import { FilterIcon } from "@/assets/icons";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";

import { AccessCustomDateStatementList, AccessMonthlyStatementsList, LanguageFilterModal } from "../components";
import {
  CUSTOM_DATE_STATEMENT_LIMIT,
  MONTHLY_STATEMENT_LIMIT,
  PAGE_OFFSET,
  StatementLanguageTypes,
  StatementTypes,
} from "../constants";
import { useStatementContext } from "../contexts/StatementContext";
import { useGetCustomerStatements } from "../hooks/query-hooks";
import { PaginationInterface, StatementInterface } from "../types";

export default function AccessStatementScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { height: screenHeight } = useWindowDimensions();
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<StatementTypes>(StatementTypes.MONTHLY);
  const [pagination, setPagination] = useState<PaginationInterface>({
    limit: MONTHLY_STATEMENT_LIMIT,
    offset: PAGE_OFFSET,
  });
  const { setCorrelationId } = useStatementContext();
  const [activeFilter, setActiveFilter] = useState<StatementLanguageTypes | null>(null);
  const [statements, setStatements] = useState<StatementInterface[]>([]);
  const {
    data: statementsData,
    refetch: refetchStatements,
    isLoading: statementsLoading,
  } = useGetCustomerStatements(pagination, currentTab);

  const handleOnRequestStatement = () => {
    navigation.navigate("Statements.RequestStatementScreen");
  };

  const handleOnFilter = (language: StatementLanguageTypes) => {
    setActiveFilter(language);
    setIsFilterModalVisible(false);
  };

  useEffect(() => {
    setCorrelationId(generateRandomId());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setStatements(pre => [...pre, ...(statementsData?.statements ?? [])]);
  }, [statementsData]);

  const filteredStatements = useMemo(() => {
    let statementsCopy = [...statements];
    if (activeFilter) {
      statementsCopy = statements.filter(
        ({ StatementLanguage }: StatementInterface) => StatementLanguage === activeFilter
      );
    }
    return statementsCopy as unknown as StatementInterface[];
  }, [activeFilter, statements]);

  const handleOnFetchMoreStatements = async () => {
    if (statementsData?.totalRecords === statements.length) return;
    setPagination({ ...pagination, offset: pagination.offset + 1 });
  };

  const handleOnRefreshStatements = async () => {
    setStatements([]);
    if (currentTab === StatementTypes.MONTHLY) {
      const result = await refetchStatements();
      setStatements(result.data?.statements ?? []);
    } else if (currentTab === StatementTypes.CUSTOM) {
      setPagination({ limit: CUSTOM_DATE_STATEMENT_LIMIT, offset: PAGE_OFFSET });
    }
  };

  const handleOnPressStatement = (documentId: string) => {
    navigation.navigate("Statements.StatementsStack", {
      screen: "Statements.PreviewStatementScreen",
      params: {
        documentId: documentId,
      },
    });
  };

  const handleOnTabChange = (tab: StatementTypes) => {
    setStatements([]);
    if (tab === StatementTypes.MONTHLY) {
      setPagination({ limit: MONTHLY_STATEMENT_LIMIT, offset: PAGE_OFFSET });
    } else if (tab === StatementTypes.CUSTOM) {
      setPagination({ limit: CUSTOM_DATE_STATEMENT_LIMIT, offset: PAGE_OFFSET });
    }
    setCurrentTab(tab);
  };

  const renderScreen = () => {
    if (currentTab === StatementTypes.MONTHLY) {
      return (
        <AccessMonthlyStatementsList
          onPressCard={handleOnPressStatement}
          statements={filteredStatements}
          activeFilter={activeFilter}
          onClearFilter={() => setActiveFilter(null)}
          onRefresh={handleOnRefreshStatements}
          isRefreshing={statementsLoading}
        />
      );
    } else if (currentTab === StatementTypes.CUSTOM) {
      return (
        <AccessCustomDateStatementList
          onPressCard={handleOnPressStatement}
          statements={filteredStatements}
          activeFilter={activeFilter}
          onEndReached={handleOnFetchMoreStatements}
          onClearFilter={() => setActiveFilter(null)}
          onRefresh={handleOnRefreshStatements}
          isRefreshing={statementsLoading}
        />
      );
    }
  };

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
    paddingVertical: screenHeight * 0.02,
    backgroundColor: theme.palette["neutralBase-40"],
  }));

  const iconWraperStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: "auto",
    marginRight: theme.spacing["20p"],
  }));

  return (
    <Page>
      <Stack style={headerStyle} align="stretch" direction="vertical">
        <NavHeader title={t("Statements.AccessStatements.title")} />
      </Stack>
      <SafeAreaView style={mainContainer}>
        <Stack style={segmentedControlStyle} direction="horizontal">
          <SegmentedControl onPress={value => handleOnTabChange(value)} value={currentTab}>
            <SegmentedControl.Item value={StatementTypes.MONTHLY}>
              {t("Statements.AccessStatements.monthly")}
            </SegmentedControl.Item>
            <SegmentedControl.Item value={StatementTypes.CUSTOM}>
              {t("Statements.AccessStatements.customDate")}
            </SegmentedControl.Item>
          </SegmentedControl>
          <Pressable onPress={() => setIsFilterModalVisible(true)} style={iconWraperStyle}>
            <FilterIcon />
          </Pressable>
        </Stack>

        {renderScreen()}
        <LanguageFilterModal
          isVisible={isFilterModalVisible}
          onClose={() => setIsFilterModalVisible(false)}
          onFilter={handleOnFilter}
        />
      </SafeAreaView>

      <Stack style={buttonContainerStyle} align="stretch" direction="vertical">
        <Button onPress={handleOnRequestStatement}>
          {t("Statements.AccessStatements.requestStatementButtonText")}
        </Button>
      </Stack>
    </Page>
  );
}
