import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, RefreshControl, SectionList, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import { EmptyListView, SectionListFooter } from "@/components";
import Divider from "@/components/Divider";
import FullScreenLoader from "@/components/FullScreenLoader";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { DocumentInterface } from "../types";
import { groupDocumentsByStatus, SectionListDataTypes } from "../utils/group-by-status";
import DocumentCardView from "./DocumentCardView";

interface DocumentsListComponentProps {
  onEndReached: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  isRetryLoading: Array<boolean>;
  onPressCard: (documentId: string) => void;
  onRetry: (requestId: string, index: number) => void;
  onInfoIcon: () => void;
  documents: DocumentInterface[];
  isFilterActive: boolean;
}

export default function DocumentsListComponent({
  onEndReached,
  onRefresh,
  isLoading,
  onPressCard,
  onInfoIcon,
  onRetry,
  documents,
  isRetryLoading,
  isFilterActive,
}: DocumentsListComponentProps) {
  const { t } = useTranslation();
  const groupedDocuments = groupDocumentsByStatus(documents);

  const sectionFooter = () => <SectionListFooter isFilterActive={isFilterActive} />;

  const sectionHeader = ({ section }: { section: SectionListDataTypes }) => {
    return section.title === "nonDownloaded" && groupedDocuments.length > 1 ? (
      <Divider style={dividerStyle} height={4} color="neutralBase-30" />
    ) : null;
  };

  const dividerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
    marginBottom: theme.spacing["12p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);

  return (
    <Stack direction="vertical" align="stretch" gap="12p">
      <Stack direction="horizontal">
        <Typography.Text size="callout" color="neutralBase+30" weight="regular">
          {t("Documents.DocumentListScreen.DocumentListComponent.subTitle")}
          <Pressable onPress={onInfoIcon}>
            <InfoCircleIcon color={iconColor} />
          </Pressable>
        </Typography.Text>
      </Stack>
      <SectionList
        ListEmptyComponent={
          isLoading ? (
            <FullScreenLoader />
          ) : (
            <EmptyListView
              header={t("Documents.DocumentListScreen.DocumentListComponent.EmptyListView.title")}
              message={
                isFilterActive
                  ? t("Documents.DocumentListScreen.DocumentListComponent.EmptyListView.filterMessage")
                  : t("Documents.DocumentListScreen.DocumentListComponent.EmptyListView.message")
              }
            />
          )
        }
        showsVerticalScrollIndicator={false}
        sections={groupedDocuments}
        renderSectionFooter={sectionHeader}
        renderItem={item => (
          <DocumentCardView
            document={item.item}
            index={item.index}
            onPressCard={onPressCard}
            onRetry={onRetry}
            isRetryLoading={isRetryLoading[item.index]}
          />
        )}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
        onEndReachedThreshold={1}
        onEndReached={({ distanceFromEnd }) => (distanceFromEnd >= 1 ? onEndReached() : undefined)}
        keyExtractor={item => item.AdhocDocRequestId}
        ListFooterComponent={sectionFooter}
      />
    </Stack>
  );
}
