import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Share, { ShareOptions } from "react-native-share";

import { CloseIcon, FullScreenIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

import PreviewPDF from "./PreviewPDF";

export interface PDFDataInterface {
  name: string;
  type: string;
  content: string;
}

const PDF_BASE_64_PREFIX = "data:application/pdf;base64,";

interface PreviewPDFProps {
  data: PDFDataInterface | undefined;
  isLoading: boolean;
  title: string;
}

export default function PreviewAndExportPDF({ data, isLoading, title }: PreviewPDFProps) {
  const [fullPreviewMode, setFullPreviewMode] = useState(false);
  const { t } = useTranslation();

  const handleExportStatement = async () => {
    if (data !== undefined) {
      const shareOptions: ShareOptions = {
        title: data.name,
        type: "application/pdf",
        filename: Platform.OS === "ios" ? `${data?.name}.pdf` : `${data?.name}`,
        url: PDF_BASE_64_PREFIX + data.content,
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
              onPress: () => {
                // Handle close action
              },
            },
          ],
          {
            cancelable: true,
          }
        );
      }
    }
  };

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

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60" insets={["left", "right", fullPreviewMode ? "top" : ""]}>
        <NavHeader
          title={title}
          withBackButton={!fullPreviewMode}
          variant={fullPreviewMode ? "black" : "angled"}
          end={
            !isLoading && data?.content ? (
              <Pressable style={fullIconContainerStyle} onPress={() => setFullPreviewMode(!fullPreviewMode)}>
                {fullPreviewMode ? <CloseIcon /> : <FullScreenIcon width={20} height={20} />}
              </Pressable>
            ) : undefined
          }
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
              <Button onPress={handleExportStatement}>{t("PreviewPDF.exportAsPDF")}</Button>
            </View>
          ) : null}
        </ContentContainer>
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
