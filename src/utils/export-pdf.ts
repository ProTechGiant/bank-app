import { t } from "i18next";
import { Alert, Platform } from "react-native";
import Share, { ShareOptions } from "react-native-share";

import { warn } from "@/logger";

export interface PDFDataInterface {
  name: string;
  type: string;
  content: string;
}

export async function handleExportStatement(pdfData: PDFDataInterface | undefined, PDF_BASE_64_PREFIX: string) {
  if (pdfData !== undefined) {
    const shareOptions: ShareOptions = {
      title: pdfData.name,
      type: "application/pdf",
      filename: Platform.OS === "ios" ? `${pdfData?.name}.pdf` : `${pdfData?.name}`,
      url: PDF_BASE_64_PREFIX + pdfData.content,
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      warn("Result =>", JSON.stringify(ShareResponse));
    } catch (error) {
      warn("sharePdfBase64 Error =>", JSON.stringify(error));
      Alert.alert(
        t("PreviewPDF.errorMessageTitle"),
        t("PreviewPDF.errorMessage"),
        [
          {
            text: t("PreviewPDF.errorCancelText"),
            style: "cancel",
          },
        ],
        {
          cancelable: true,
        }
      );
    }
  }
}
