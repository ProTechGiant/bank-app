import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, RefreshControl, useWindowDimensions, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { StatementLanguageTypes } from "../constants";
import { StatementInterface } from "../types";
import EmptyListView from "./EmptyListView";
import FilterButton from "./FilterButton";

interface AccessCustomDateStatementsListProps {
  statements: StatementInterface[];
  activeFilter: StatementLanguageTypes | null;
  onClearFilter: () => void;
  onEndReached: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onPressCard: (documentId: string) => void;
}

export default function AccessCustomDateStatementList({
  statements,
  onClearFilter,
  activeFilter,
  onEndReached,
  onRefresh,
  isRefreshing,
  onPressCard,
}: AccessCustomDateStatementsListProps) {
  const { t } = useTranslation();
  const { height: screenHeight } = useWindowDimensions();

  const formatDateRange = (startDateString: string, endDateString: string) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    const formattedStartDate = format(startDate, "dd MMM yyyy");
    const formattedEndDate = format(endDate, "dd MMM yyyy");
    return `${formattedStartDate} - ${formattedEndDate}`;
  };

  const dateBadge = (date: string) => {
    return (
      <Typography.Text size="footnote" weight="medium" style={dateBadgeStyle} color="neutralBase-60">
        {format(new Date(date), "dd MMM yyyy")}
      </Typography.Text>
    );
  };

  const renderItem = ({ item }: { item: StatementInterface }) => {
    return (
      <Pressable onPress={() => onPressCard(item.DocumentId)}>
        <Stack direction="horizontal" style={renderItemStyle} align="center" justify="space-between">
          <Stack direction="vertical">
            {dateBadge(item.StatementEndDate)}
            <Typography.Text style={renderItemDateStyle} color="neutralBase+30" size="callout" weight="medium">
              {formatDateRange(item.StatementStartDate, item.StatementEndDate)}
            </Typography.Text>
            <Typography.Text style={renderItemDateStyle} color="neutralBase-10" size="footnote">
              {item.StatementLanguage}
            </Typography.Text>
          </Stack>
          <ChevronRightIcon color="#B3B3B3" />
        </Stack>
      </Pressable>
    );
  };

  const sectionListFooter = () => <View style={{ marginBottom: screenHeight * 0.3 }} />;

  const renderItemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["16p"],
    marginBottom: theme.spacing["8p"],
    borderWidth: 1,
    borderRadius: theme.radii.small,
    borderColor: theme.palette["neutralBase-30"],
  }));

  const dateBadgeStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.neutralBase,
    paddingVertical: theme.spacing["4p"],
    paddingHorizontal: theme.spacing["8p"],
    marginBottom: theme.spacing["8p"],
    alignItems: "center",
  }));

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const renderItemDateStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["4p"],
  }));

  const statementTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <Stack style={mainContainerStyle} direction="vertical" align="stretch">
      {activeFilter ? <FilterButton lable={activeFilter} onClearFilter={onClearFilter} /> : null}
      <Typography.Text style={statementTextStyle} color="neutralBase-10">
        {t("Statements.AccessStatements.customDateStatementSubtitle")}
      </Typography.Text>

      <FlatList
        ListEmptyComponent={<EmptyListView isFilterActive={!!activeFilter} />}
        showsVerticalScrollIndicator={false}
        data={statements}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        onEndReachedThreshold={2}
        onEndReached={onEndReached}
        keyExtractor={item => item.DocumentId}
        ListFooterComponent={sectionListFooter}
      />
    </Stack>
  );
}
