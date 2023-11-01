import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import { RequiredDocumentInterface } from "../types";
import UploadDocumentCard from "./UploadDocumentCard";

interface UploadDocumentCardListProps {
  documents: RequiredDocumentInterface[];
  onPressUpload: (guid: string) => void;
  onViewDocument: (guid: string) => void;
  uploadedDocumentsGuidz: string[];
}

export default function UploadDocumentCardList({
  documents,
  onViewDocument,
  onPressUpload,
  uploadedDocumentsGuidz,
}: UploadDocumentCardListProps) {
  const { i18n } = useTranslation();

  const listContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));
  return (
    <View style={listContainerStyle}>
      <FlatList
        data={documents}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <UploadDocumentCard
            documentIndex={index + 1}
            isUploaded={uploadedDocumentsGuidz.includes(item.DocumentGuid)}
            onPressUpload={onPressUpload}
            onViewDocument={onViewDocument}
            annotationGuid={item.AnnotationGuid}
            comments={item.Reason}
            description={i18n.language === "ar" ? item.DescriptionAr : item.DescriptionEn}
            status={item.DocumentStatus}
            title={i18n.language === "ar" ? item.NameAr : item.Name}
            documentGuid={item.DocumentGuid}
          />
        )}
      />
    </View>
  );
}
