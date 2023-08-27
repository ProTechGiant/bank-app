import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View, ViewStyle } from "react-native";
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

import { PreviewStatementPDF } from "../components";
import { STATEMENT_BASE_64_PREFIX } from "../constants";
import { useDownloadStatement } from "../hooks/query-hooks";
import { StatementsStackParams } from "../StatementsStack";

export default function PreviewStatementScreen() {
  const [fullPreviewMode, setFullPreviewMode] = useState(false);
  const route = useRoute<RouteProp<StatementsStackParams, "Statements.PreviewStatementScreen">>();
  const documentId = route.params?.documentId;
  const { data, isLoading } = useDownloadStatement(documentId);
  const { t } = useTranslation();

  const handleExportStatement = async () => {
    if (data !== undefined) {
      const shareOptions: ShareOptions = {
        title: data.StatementName,
        type: "application/pdf",
        url: STATEMENT_BASE_64_PREFIX + data.StatementContent,
      };

      try {
        const ShareResponse = await Share.open(shareOptions);
        warn("Result =>", JSON.stringify(ShareResponse));
      } catch (error) {
        warn("sharePdfBase64 Error =>", JSON.stringify(error));
        Alert.alert(
          t("Statements.PreviewStatementScreen.errorMessageTitle"),
          t("Statements.PreviewStatementScreen.errorMessage"),
          [
            {
              text: t("Statements.PreviewStatementScreen.errorCancelText"),
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
          title={t("Statements.PreviewStatementScreen.title")}
          withBackButton={!fullPreviewMode}
          variant={fullPreviewMode ? "black" : "angled"}
          end={
            !isLoading && data?.StatementContent ? (
              <Pressable style={fullIconContainerStyle} onPress={() => setFullPreviewMode(!fullPreviewMode)}>
                {fullPreviewMode ? <CloseIcon /> : <FullScreenIcon width={20} height={20} />}
              </Pressable>
            ) : undefined
          }
        />

        <ContentContainer>
          {isLoading ? (
            <FullScreenLoader />
          ) : data?.StatementContent === undefined ? (
            <ContentContainer style={styles.container}>
              <Typography.Text weight="regular" size="title3" align="center">
                {t("Statements.PreviewStatementScreen.nothingToShowText")}
              </Typography.Text>
            </ContentContainer>
          ) : (
            <PreviewStatementPDF
              fullPreviewMode={fullPreviewMode}
              source={{ uri: STATEMENT_BASE_64_PREFIX + data.StatementContent }}
            />
          )}
          {data?.StatementContent && !isLoading && !fullPreviewMode ? (
            <View style={bottomButtonContainerStyle}>
              <Button onPress={handleExportStatement}>{t("Statements.PreviewStatementScreen.exportAsPDF")}</Button>
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
