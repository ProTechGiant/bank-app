import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { CloseIcon, FullScreenIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { handleExportStatement, PDFDataInterface } from "@/utils/export-pdf";

import NotificationModal from "../NotificationModal";
import Stack from "../Stack";
import PreviewPDF from "./PreviewPDF";

const PDF_BASE_64_PREFIX = "data:application/pdf;base64,";

interface PreviewPDFProps {
  data: PDFDataInterface | undefined;
  isLoading: boolean;
  title: string;
  testID?: string;
}

export default function PreviewAndExportPDF({ data, isLoading, title }: PreviewPDFProps) {
  const [fullPreviewMode, setFullPreviewMode] = useState(false);
  const [showDownloadDocumentModal, setShowDownloadDocumentModal] = useState(false);
  const { t } = useTranslation();

  const bottomButtonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    marginVertical: theme.spacing["16p"],
  }));

  const fullIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60-60%"],
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    height: 32,
    width: 32,
  }));

  const navHeaderStyle = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60" insets={["left", "right", fullPreviewMode ? "top" : ""]}>
        <NavHeader
          title={title}
          withBackButton={!fullPreviewMode}
          variant={fullPreviewMode ? "black" : "branded"}
          backgroundAngledColor={navHeaderStyle}
          end={
            !isLoading && data?.content ? (
              <Stack direction="horizontal" gap="8p">
                <Pressable style={fullIconContainerStyle} onPress={() => setFullPreviewMode(!fullPreviewMode)}>
                  {fullPreviewMode ? <CloseIcon /> : <FullScreenIcon width={20} height={20} />}
                </Pressable>
              </Stack>
            ) : undefined
          }
          testID="PreviewPDF:NavHeader"
        />

        <ContentContainer>
          {isLoading ? (
            <FullScreenLoader />
          ) : data?.content === undefined ? (
            <ContentContainer style={styles.container}>
              <Typography.Text weight="regular" size="title3" align="center">
                {t("PreviewPDF.nothingToShowText")}
              </Typography.Text>
            </ContentContainer>
          ) : (
            <PreviewPDF fullPreviewMode={fullPreviewMode} source={{ uri: PDF_BASE_64_PREFIX + data.content }} />
          )}
          {data?.content && !isLoading && !fullPreviewMode ? (
            <View style={bottomButtonContainerStyle}>
              <Button
                onPress={() => handleExportStatement(data, PDF_BASE_64_PREFIX)}
                testID="PreviewPDF:ExportPDFButton">
                {t("PreviewPDF.exportAsPDF")}
              </Button>
            </View>
          ) : null}
        </ContentContainer>
        <NotificationModal
          variant="success"
          title={t("PreviewPDF.downloadSuccessfully")}
          onClose={() => setShowDownloadDocumentModal(false)}
          isVisible={showDownloadDocumentModal}
          buttons={{
            primary: (
              <Button onPress={() => setShowDownloadDocumentModal(false)} testID="PreviewPDF:NotificationCloseButton">
                {t("PreviewPDF.errorCancelText")}
              </Button>
            ),
          }}
        />
      </Page>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
