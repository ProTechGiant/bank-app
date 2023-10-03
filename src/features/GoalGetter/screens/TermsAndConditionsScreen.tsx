import { RouteProp, useRoute } from "@react-navigation/native";
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

import { GoalGetterStackParams } from "../GoalGetterStack";
import { useGetTermsAndConditions } from "../hooks/query-hooks";

const PDF_BASE_64_PREFIX = "data:application/pdf;base64,";

export default function TermsAndConditionsScreen() {
  const { t } = useTranslation();

  const { params } = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.TermsAndConditionsScreen">>();
  const { data, isLoading } = useGetTermsAndConditions(params.productId);
  const [pdfData, setPdfData] = useState<PDFDataInterface | undefined>(undefined);

  useEffect(() => {
    if (data !== undefined) {
      const pdf = {
        name: "terms and conditions",
        content: data.TermsAndConditions,
        type: "pdf",
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
