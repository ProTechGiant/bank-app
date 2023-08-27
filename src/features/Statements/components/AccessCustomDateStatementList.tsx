import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, RefreshControl, SectionList, useWindowDimensions, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import Divider from "@/components/Divider";
import FullScreenLoader from "@/components/FullScreenLoader";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { StatementLanguageTypes } from "../constants";
import { StatementInterface } from "../types";
import { groupCustomStatmentsByStatus, SectionListDataTypes } from "../utils/group-monthly-statements-by-year";
import CustomStatementView from "./CustomStatementCardView";
import EmptyListView from "./EmptyListView";
import FilterButton from "./FilterButton";

interface AccessCustomDateStatementsListProps {
  statements: StatementInterface[];
  activeFilter: StatementLanguageTypes | null;
  onClearFilter: () => void;
  onEndReached: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  isRetryLoading: Array<boolean>;
  onPressCard: (documentId: string) => void;
  onRetry: (requestId: string, index: number) => void;
  onInfoIcon: () => void;
}

export default function AccessCustomDateStatementList({
  statements,
  onClearFilter,
  activeFilter,
  onEndReached,
  onRefresh,
  isLoading,
  onPressCard,
  onInfoIcon,
  onRetry,
  isRetryLoading,
}: AccessCustomDateStatementsListProps) {
  const { t } = useTranslation();
  const { height: screenHeight } = useWindowDimensions();
  const sectionListFooter = () => <View style={{ marginBottom: screenHeight * 0.3 }} />;
  const sectionHeader = ({ section }: { section: SectionListDataTypes }) => {
    return section.title === "Downloaded" && groupCustomStatmentsByStatus(statements).length > 1 ? (
      <Divider style={dividerStyle} height={4} color="neutralBase-30" />
    ) : null;
  };

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const statementTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
    lineHeight: theme.spacing["4p"],
  }));

  const dividerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
    marginBottom: theme.spacing["12p"],
  }));

  return (
    <Stack style={mainContainerStyle} direction="vertical" align="stretch">
      {activeFilter ? (
        <FilterButton label={t(`Statements.AccessStatements.${activeFilter}`)} onClearFilter={onClearFilter} />
      ) : null}

      <Stack direction="horizontal">
        <Typography.Text style={statementTextStyle} color="neutralBase-10">
          {t("Statements.AccessStatements.customDateStatementSubtitle")}
          <Pressable onPress={onInfoIcon}>
            <InfoCircleIcon />
          </Pressable>
        </Typography.Text>
      </Stack>
      <SectionList
        ListEmptyComponent={isLoading ? <FullScreenLoader /> : <EmptyListView isFilterActive={!!activeFilter} />}
        showsVerticalScrollIndicator={false}
        sections={groupCustomStatmentsByStatus(statements)}
        renderSectionHeader={sectionHeader}
        data={statements}
        renderItem={item => (
          <CustomStatementView
            isRetryLoading={isRetryLoading[item.index]}
            statement={item.item}
            index={item.index}
            onPressCard={onPressCard}
            onRetry={onRetry}
          />
        )}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
        onEndReachedThreshold={1}
        onEndReached={({ distanceFromEnd }) => (distanceFromEnd >= 1 ? onEndReached() : undefined)}
        keyExtractor={item => item.CBSReferenceNumber}
        ListFooterComponent={sectionListFooter}
      />
    </Stack>
  );
}
