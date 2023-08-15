import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl, SectionList, useWindowDimensions, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { MonthNameTypes, StatementLanguageTypes } from "../constants";
import { StatementInterface } from "../types";
import { groupMonthlyStatementsByYear, SectionListDataTypes } from "../utils/group-monthly-statements-by-year";
import EmptyListView from "./EmptyListView";
import FilterButton from "./FilterButton";

interface AccessMonthlyStatementsListProps {
  statements: StatementInterface[];
  activeFilter: StatementLanguageTypes | null;
  onClearFilter: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function AccessMonthlyStatmentsList({
  statements,
  activeFilter,
  onClearFilter,
  onRefresh,
  isRefreshing,
}: AccessMonthlyStatementsListProps) {
  const { t } = useTranslation();
  const { height: screenHeight } = useWindowDimensions();

  const getMonthNameFromDateString = (dateString: string): string => {
    const [year, month] = dateString.split("-");
    const date = new Date(+year, +month);
    const monthName = format(date, "MMMM").toLowerCase() as MonthNameTypes;
    return t(`Statements.AccessStatements.MonthNames.${monthName}`);
  };

  const renderItem = ({
    item,
    index,
    section,
  }: {
    item: StatementInterface;
    index: number;
    section: SectionListDataTypes;
  }) => {
    const isLastItem = index === section.data.length - 1;
    return (
      <Stack
        direction="horizontal"
        justify="space-between"
        align="center"
        style={[renderItemStyle, !index ? topBorderRadiusStyle : null, isLastItem ? bottomBorderRadiusStyle : null]}>
        <Typography.Text>{getMonthNameFromDateString(item.StatementEndDate)}</Typography.Text>
        <Stack style={languageTextStyle} align="center" direction="horizontal">
          <Typography.Text size="caption1" color="neutralBase">
            {item.StatementLanguage}
          </Typography.Text>
          <ChevronRightIcon color="#D9D9D9" />
        </Stack>
      </Stack>
    );
  };

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <Stack style={renderSectionHeaderStyle} direction="vertical">
      <Typography.Text size="title2" weight="medium" color="neutralBase+30">
        {title}
      </Typography.Text>
    </Stack>
  );

  const sectionListFooter = () => <View style={{ marginBottom: screenHeight * 0.3 }} />;

  const renderSectionHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-40"],
  }));

  const topBorderRadiusStyle = useThemeStyles<ViewStyle>(theme => ({
    borderTopLeftRadius: theme.radii.small,
    borderTopRightRadius: theme.radii.small,
  }));

  const bottomBorderRadiusStyle = useThemeStyles<ViewStyle>(theme => ({
    borderBottomLeftRadius: theme.radii.small,
    borderBottomRightRadius: theme.radii.small,
    borderBottomWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    marginBottom: theme.spacing["24p"],
  }));

  const renderItemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
    paddingHorizontal: theme.spacing["16p"],
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
  }));

  const languageTextStyle = useThemeStyles<ViewStyle>(theme => ({
    columnGap: theme.spacing["12p"],
  }));

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const statementTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <Stack style={mainContainerStyle} direction="vertical" align="stretch">
      {activeFilter ? <FilterButton lable={activeFilter} onClearFilter={onClearFilter} /> : null}
      <Typography.Text style={statementTextStyle} color="neutralBase-10">
        {t("Statements.AccessStatements.monthlyStatementSubtitle")}
      </Typography.Text>
      <SectionList
        ListEmptyComponent={<EmptyListView isFilterActive={!!activeFilter} />}
        showsVerticalScrollIndicator={false}
        sections={groupMonthlyStatementsByYear(statements)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={item => item.DocumentId}
        ListFooterComponent={sectionListFooter}
      />
    </Stack>
  );
}
