import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { PrintIcon, ShareDocumentIcon } from "@/assets/icons";
import { Link, Stack } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import PreviewPDF from "@/components/PreviewAndExportPDF/PreviewPDF";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { handleExportStatement, PDFDataInterface } from "@/utils/export-pdf";

import BadGateWay from "../assets/BadGateWay.svg";
import ResponseError from "../assets/Error.svg";

const PDF_BASE_64_PREFIX = "data:application/pdf;base64,";

interface PreviewPDFProps {
  data: PDFDataInterface | undefined;
  isLoading: boolean;
  title: string;
  testID?: string;
  status: string;
  refetch: () => void;
}

export default function PreviewAndExportPDF({ data, isLoading, title, status, refetch }: PreviewPDFProps) {
  const navigation = useNavigation();
  const [fullPreviewMode] = useState(false);
  const [showDownloadDocumentModal, setShowDownloadDocumentModal] = useState(false);
  const { t } = useTranslation();

  const footerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["16p"],
    width: "100%",
    backgroundColor: theme.palette["neutralBase-60"],
    bottom: 0,
    justifyContent: "space-between",
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
        <View style={containerStyle}>
          <Typography.Text color="neutralBase+30" weight="medium" size="title1">
            {title}
          </Typography.Text>
        </View>
        {isLoading ? (
          <FullScreenLoader />
        ) : data?.content === undefined ? (
          status === "505" ? (
            <ContentContainer style={styles.container}>
              <Stack direction="vertical" gap="8p" align="center" justify="center" style={styles.stackContainer}>
                <BadGateWay />
                <Typography.Text weight="medium" size="callout" align="center">
                  {t("MutualFund.PrintFileScreen.error.status505")}
                </Typography.Text>
                <Typography.Text weight="regular" size="footnote" align="center">
                  {t("MutualFund.PrintFileScreen.error.badGateway")}
                </Typography.Text>
              </Stack>
            </ContentContainer>
          ) : true ? (
            <ContentContainer style={styles.container}>
              <Stack direction="vertical" gap="8p" align="center" justify="center" style={styles.stackContainer}>
                <ResponseError />
                <Typography.Text weight="medium" size="callout" align="center">
                  {t("MutualFund.PrintFileScreen.error.status500")}
                </Typography.Text>
                <Typography.Text weight="regular" size="footnote" align="center">
                  {t("MutualFund.PrintFileScreen.error.message")}
                </Typography.Text>
                <Link children={t("MutualFund.PrintFileScreen.error.retry")} onPress={refetch} />
              </Stack>
            </ContentContainer>
          ) : status === "401" ? (
            <ContentContainer style={styles.container}>
              <Stack direction="vertical" gap="8p" align="center" justify="center" style={styles.stackContainer}>
                <ResponseError />
                <Typography.Text weight="medium" size="callout" align="center">
                  {t("MutualFund.PrintFileScreen.error.status401")}
                </Typography.Text>
                <Typography.Text weight="regular" size="footnote" align="center">
                  {t("MutualFund.PrintFileScreen.error.message")}
                </Typography.Text>
                <Link children={t("MutualFund.PrintFileScreen.error.retry")} onPress={refetch} />
              </Stack>
            </ContentContainer>
          ) : null
        ) : (
          <PreviewPDF fullPreviewMode={fullPreviewMode} source={{ uri: PDF_BASE_64_PREFIX + data.content }} />
        )}
        {data?.content && !isLoading && !fullPreviewMode ? (
          <Stack direction="horizontal" style={footerStyle}>
            <Pressable onPress={() => handleExportStatement(data, PDF_BASE_64_PREFIX)}>
              <PrintIcon />
            </Pressable>
            <Pressable onPress={() => handleExportStatement(data, PDF_BASE_64_PREFIX)}>
              <ShareDocumentIcon />
            </Pressable>
          </Stack>
        ) : null}
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
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  stackContainer: {
    width: "60%",
  },
});
