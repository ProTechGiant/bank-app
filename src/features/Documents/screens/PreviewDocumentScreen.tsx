import { RouteProp, useRoute } from "@react-navigation/native";
import { t } from "i18next";
import React, { useEffect, useState } from "react";

import NotificationModal from "@/components/NotificationModal";
import PreviewAndExportPDF, { PDFDataInterface } from "@/components/PreviewAndExportPDF";
import useNavigation from "@/navigation/use-navigation";

import { DocumentsStackParams } from "../DocumentsStack";
import { useDownloadDocument } from "../hooks/query-hooks";

export default function PreviewStatementScreen() {
  const route = useRoute<RouteProp<DocumentsStackParams, "Documents.PreviewDocumentScreen">>();
  const documentId = route.params?.documentId;
  const [pdfData, setPdfData] = useState<PDFDataInterface | undefined>(undefined);
  const { data, isLoading, error } = useDownloadDocument(documentId);
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (data !== undefined) {
      const pdf = {
        name: data.DocumentName,
        content: data.DocumentContent,
        type: data.DocumentType,
      };
      setPdfData(pdf);
    } else if (error) {
      setIsNotificationModalVisible(true);
    }
  }, [data, error, navigation]);

  return (
    <>
      <PreviewAndExportPDF data={pdfData} title={t("Documents.PreviewDocumentScreen.title")} isLoading={isLoading} />

      <NotificationModal
        isVisible={isNotificationModalVisible}
        message={t("Documents.RequestDocumentScreen.pleaseTryAgain")}
        onClose={() => {
          setIsNotificationModalVisible(false);
          navigation.goBack();
        }}
        title={t("Documents.RequestDocumentScreen.somethingWentWrong")}
        variant="error"
      />
    </>
  );
}
