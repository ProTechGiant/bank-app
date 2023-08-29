import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, RefreshControl, SectionList, useWindowDimensions, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import { EmptyListView } from "@/components";
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
  onPressCard: (documentId: string) => void;
  onRetry: (requestId: string, index: number) => void;
  onInfoIcon: () => void;
  documents: DocumentInterface[];
}

export default function DocumentsListComponent({
  onEndReached,
  onRefresh,
  isLoading,
  onPressCard,
  onInfoIcon,
  onRetry,
  documents,
}: DocumentsListComponentProps) {
  const { t } = useTranslation();
  const { height: screenHeight } = useWindowDimensions();
  const groupedDocuments = groupDocumentsByStatus(documents);

  const sectionListFooter = () => <View style={{ marginBottom: screenHeight * 0.3 }} />;
  const sectionHeader = ({ section }: { section: SectionListDataTypes }) => {
    return section.title === "nonDownloaded" && groupedDocuments.length > 1 ? (
      <Divider style={dividerStyle} height={4} color="neutralBase-30" />
    ) : null;
  };

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const documentTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
    lineHeight: theme.spacing["4p"],
  }));

  const dividerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
    marginBottom: theme.spacing["12p"],
  }));

  return (
    <Stack style={mainContainerStyle} direction="vertical" align="stretch">
      <Stack direction="horizontal">
        <Typography.Text style={documentTextStyle} color="neutralBase-10">
          {t("Documents.DocumentListScreen.DocumentListComponent.subTitle")}
          <Pressable onPress={onInfoIcon}>
            <InfoCircleIcon />
          </Pressable>
        </Typography.Text>
      </Stack>
      <SectionList
        ListEmptyComponent={isLoading ? <FullScreenLoader /> : <EmptyListView isFilterActive={false} />}
        showsVerticalScrollIndicator={false}
        sections={groupedDocuments}
        renderSectionFooter={sectionHeader}
        renderItem={item => (
          <DocumentCardView
            document={item.item}
            index={item.index}
            onPressCard={onPressCard}
            onRetry={onRetry}
            isRetryLoading={false}
          />
        )}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
        onEndReachedThreshold={1}
        onEndReached={({ distanceFromEnd }) => (distanceFromEnd >= 1 ? onEndReached() : undefined)}
        keyExtractor={item => item.AdhocDocRequestId}
        ListFooterComponent={sectionListFooter}
      />
    </Stack>
  );
}
