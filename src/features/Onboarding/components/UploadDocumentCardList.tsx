import React from "react";
import { FlatList, View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import { RequiredDocumentInterface } from "../types";
import UploadDocumentCard from "./UploadDocumentCard";

interface UploadDocumentCardListProps {
  documents: RequiredDocumentInterface[];
}

export default function UploadDocumentCardList({ documents }: UploadDocumentCardListProps) {
  const listContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));
  return (
    <View style={listContainerStyle}>
      <FlatList
        data={documents}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <UploadDocumentCard description={item.DescriptionEn} status={item.DocumentStatus} title={item.Name} />
        )}
      />
    </View>
  );
}
