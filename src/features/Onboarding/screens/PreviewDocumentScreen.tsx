import { RouteProp, useRoute } from "@react-navigation/native";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";

import PreviewAndExportImage from "@/components/PreviewAndExportImage";
import PreviewAndExportPDF from "@/components/PreviewAndExportPDF";
import { warn } from "@/logger";
import { PDFDataInterface } from "@/utils/export-pdf";

import { useDownloadHighRiskDocument } from "../hooks/query-hooks";
import { OnboardingStackParams } from "../OnboardingStack";

export default function PreviewDocumentScreen() {
  const route = useRoute<RouteProp<OnboardingStackParams, "Onboarding.PreviewDocumentScreen">>();
  const { data: documentData, isLoading, mutateAsync } = useDownloadHighRiskDocument();
  const [pdfData, setPdfData] = useState<PDFDataInterface | undefined>(undefined);

  useEffect(() => {
    if (!documentData) {
      handleOnDownload();
    }
  }, [route.params]);

  const handleOnDownload = async () => {
    try {
      if (route.params.caseAnnotationId) {
        const result = await mutateAsync(route.params.caseAnnotationId);
        const pdf = {
          name: result?.DocumentName,
          content: result?.DocumentBodyBase64String,
          type: result?.DocumentType,
        };
        setPdfData(pdf);
      } else {
        setPdfData(route.params.base64File);
      }
    } catch (err) {
      warn("Error while downloading PDF: ", JSON.stringify(err));
    }
  };

  return pdfData?.type.includes("image") && pdfData?.content !== undefined ? (
    <PreviewAndExportImage
      data={pdfData}
      title={t("Onboarding.UploadDocumentScreen.previewDocument")}
      isLoading={isLoading}
    />
  ) : (
    <PreviewAndExportPDF
      data={pdfData}
      title={t("Onboarding.UploadDocumentScreen.previewDocument")}
      isLoading={isLoading}
    />
  );
}
