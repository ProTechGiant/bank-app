import { RouteProp, useRoute } from "@react-navigation/native";
import { t } from "i18next";
import React, { useEffect, useState } from "react";

import PreviewAndExportPDF from "@/components/PreviewAndExportPDF";
import { PDFDataInterface } from "@/utils/export-pdf";

import { useDownloadStatement } from "../hooks/query-hooks";
import { StatementsStackParams } from "../StatementsStack";

export default function PreviewStatementScreen() {
  const route = useRoute<RouteProp<StatementsStackParams, "Statements.PreviewStatementScreen">>();
  const documentId = route.params?.documentId;
  const [pdfData, setPdfData] = useState<PDFDataInterface | undefined>(undefined);
  const { data, isLoading } = useDownloadStatement(documentId);

  useEffect(() => {
    if (data !== undefined) {
      const pdf = {
        name: data.StatementName,
        content: data.StatementContent,
        type: data.StatementType,
      };
      setPdfData(pdf);
    }
  }, [data]);

  return (
    <PreviewAndExportPDF data={pdfData} title={t("Statements.PreviewStatementScreen.title")} isLoading={isLoading} />
  );
}
