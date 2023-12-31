import { useTranslation } from "react-i18next";

import PreviewAndExportPDF from "../components/PreviewAndExportPDF";
import { useGetOrderListFile } from "../hooks/query-hooks";

export interface PDFDataInterface {
  name: string;
  type: string;
  content: string;
}
export default function PrintFileScreen() {
  const { t } = useTranslation();
  const { data: termsAndConditions, isLoading, refetch, status } = useGetOrderListFile();

  return (
    <PreviewAndExportPDF
      testID="Documents.PreviewDocumentScreen:PreviewAndExportPDF"
      data={termsAndConditions}
      title={t("MutualFund.PrintFileScreen.title")}
      isLoading={isLoading}
      status={status}
      refetch={refetch}
    />
  );
}
