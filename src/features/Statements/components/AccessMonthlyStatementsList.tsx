import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, RefreshControl, SectionList, useWindowDimensions, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { EmptyListView } from "@/components";
import FullScreenLoader from "@/components/FullScreenLoader";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { MonthNameTypes, StatementLanguageTypes, StatementStatus } from "../constants";
import { StatementInterface } from "../types";
import { groupMonthlyStatementsByYear, SectionListDataTypes } from "../utils/group-monthly-statements-by-year";
import FilterButton from "./FilterButton";

interface AccessMonthlyStatementsListProps {
  statements: StatementInterface[];
  activeFilter: StatementLanguageTypes | null;
  onClearFilter: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  onPressCard: (documentId: string) => void;
}

export default function AccessMonthlyStatementsList({
  statements,
  activeFilter,
  onClearFilter,
  onRefresh,
  isLoading,
  onPressCard,
}: AccessMonthlyStatementsListProps) {
  const { t } = useTranslation();
  const { height: screenHeight } = useWindowDimensions();

  const getMonthNameFromDateString = (dateString: string): string => {
    if (!dateString?.length) return "";

    const [year, month] = dateString.split("-");
    const date = new Date(+year, +month - 1);
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
      <Pressable onPress={() => onPressCard(item.DocumentId)}>
        <Stack
          direction="horizontal"
          justify="space-between"
          align="center"
          style={[renderItemStyle, !index ? topBorderRadiusStyle : null, isLastItem ? bottomBorderRadiusStyle : null]}>
          <Typography.Text color={item.Status === StatementStatus.GENERATED ? "complimentBase" : "neutralBase+30"}>
            {getMonthNameFromDateString(item.StatementGenerationDate)}
          </Typography.Text>
          <Stack style={languageTextStyle} align="center" direction="horizontal">
            <Typography.Text size="caption1" color="neutralBase">
              {t(`Statements.AccessStatements.${item.StatementLanguage}`)}
            </Typography.Text>
            <ChevronRightIcon color="#D9D9D9" />
          </Stack>
        </Stack>
      </Pressable>
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
      {activeFilter ? (
        <FilterButton label={t(`Statements.AccessStatements.${activeFilter}`)} onClearFilter={onClearFilter} />
      ) : null}
      <Typography.Text style={statementTextStyle} color="neutralBase-10">
        {t("Statements.AccessStatements.monthlyStatementSubtitle")}
      </Typography.Text>
      <SectionList
        ListEmptyComponent={isLoading ? <FullScreenLoader /> : <EmptyListView isFilterActive={!!activeFilter} />}
        showsVerticalScrollIndicator={false}
        sections={groupMonthlyStatementsByYear(statements)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={item => item.CBSReferenceNumber}
        ListFooterComponent={sectionListFooter}
      />
    </Stack>
  );
}
