import { RouteProp, useRoute } from "@react-navigation/native";
import { t } from "i18next";
import React, { useEffect, useState } from "react";

import PreviewAndExportPDF, { PDFDataInterface } from "@/components/PreviewAndExportPDF";

import { DocumentsStackParams } from "../DocumentsStack";
import { useDownloadDocument } from "../hooks/query-hooks";

export default function PreviewStatementScreen() {
  const route = useRoute<RouteProp<DocumentsStackParams, "Documents.PreviewDocumentScreen">>();
  const documentId = route.params?.documentId;
  const [pdfData, setPdfData] = useState<PDFDataInterface | undefined>(undefined);
  const { data, isLoading } = useDownloadDocument(documentId);

  useEffect(() => {
    if (data !== undefined) {
      const pdf = {
        name: data.DocumentName,
        content: data.DocumentContent,
        type: data.DocumentType,
      };
      setPdfData(pdf);
    }
  }, [data]);

  return (
    <PreviewAndExportPDF data={pdfData} title={t("Documents.PreviewDocumentScreen.title")} isLoading={isLoading} />
  );
}
