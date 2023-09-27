import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { DownloadIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import PreviewPDF from "@/components/PreviewAndExportPDF/PreviewPDF";
import Typography from "@/components/Typography";
import { handleExportStatement, PDFDataInterface } from "@/utils/export-pdf";

import { useGetTermsAndConditions } from "../hooks/query-hooks";

const PDF_BASE_64_PREFIX = "data:application/pdf;base64,";

export default function TermsAndConditionsScreen() {
  const { t } = useTranslation();

  //TODO - when api will be ready for terms and condition useGetTermsAndConditions will be change depending on api
  const { data, isLoading } = useGetTermsAndConditions("3121");
  const [pdfData, setPdfData] = useState<PDFDataInterface | undefined>(undefined);

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
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={t("GoalGetter.TermsAndConditionsScreen.title")}
        end={
          <NavHeader.IconEndButton
            icon={<DownloadIcon />}
            onPress={() => handleExportStatement(pdfData, PDF_BASE_64_PREFIX)}
          />
        }
        variant="background"
      />

      <ContentContainer isScrollView>
        {isLoading ? (
          <FullScreenLoader />
        ) : pdfData?.content === undefined ? (
          <ContentContainer style={styles.container}>
            <Typography.Text weight="regular" size="title3" align="center">
              {t("GoalGetter.TermsAndConditionsScreen.nothingToShowText")}
            </Typography.Text>
          </ContentContainer>
        ) : (
          <PreviewPDF source={{ uri: PDF_BASE_64_PREFIX + pdfData.content }} fullPreviewMode={true} />
        )}
      </ContentContainer>
    </Page>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
