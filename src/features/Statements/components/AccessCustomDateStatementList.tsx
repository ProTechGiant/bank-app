import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, RefreshControl, useWindowDimensions, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import FullScreenLoader from "@/components/FullScreenLoader";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { StatementLanguageTypes } from "../constants";
import { StatementInterface } from "../types";
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
  onPressCard: (documentId: string) => void;
  onRetry: (documentId: string) => void;
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
}: AccessCustomDateStatementsListProps) {
  const { t } = useTranslation();
  const { height: screenHeight } = useWindowDimensions();
  const sectionListFooter = () => <View style={{ marginBottom: screenHeight * 0.3 }} />;

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const statementTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
    lineHeight: theme.spacing["4p"],
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
      <FlatList
        ListEmptyComponent={isLoading ? <FullScreenLoader /> : <EmptyListView isFilterActive={!!activeFilter} />}
        showsVerticalScrollIndicator={false}
        data={statements}
        renderItem={item => <CustomStatementView statement={item.item} onPressCard={onPressCard} onRetry={onRetry} />}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
        onEndReachedThreshold={1}
        onEndReached={({ distanceFromEnd }) => (distanceFromEnd >= 1 ? onEndReached() : undefined)}
        keyExtractor={item => item.CBSReferenceNumber}
        ListFooterComponent={sectionListFooter}
      />
    </Stack>
  );
}
