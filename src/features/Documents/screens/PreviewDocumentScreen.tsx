import { RouteProp, useRoute } from "@react-navigation/native";
import { t } from "i18next";
import React, { useEffect, useState } from "react";

import PreviewAndExportPDF, { PDFDataInterface } from "@/components/PreviewAndExportPDF";

import { DocumentsStackParams } from "../DocumentsStack";
import { useDownloadDocument } from "../hooks/query-hooks";
import { BASE64PDF } from "../mock/mock";

export default function PreviewStatementScreen() {
  const route = useRoute<RouteProp<DocumentsStackParams, "Documents.PreviewDocumentScreen">>();
  const documentId = route.params?.documentId;
  const [pdfData, setPdfData] = useState<PDFDataInterface | undefined>(undefined);
  const { data, isLoading } = useDownloadDocument(documentId);

  useEffect(() => {
    const pdf = {
      name: "DOCUMENT",
      content: BASE64PDF,
      type: "PDF",
    };
    setPdfData(pdf);
  }, [data]);

  return (
    <PreviewAndExportPDF data={pdfData} title={t("Documents.PreviewDocumentScreen.title")} isLoading={isLoading} />
  );
}
