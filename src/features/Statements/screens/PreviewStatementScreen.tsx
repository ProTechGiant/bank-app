import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { useDownloadStatement } from "../hooks/query-hooks";
import { STATEMENT_BASE_64_PREFIX } from "../mocks/AccessStatementData";
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
        title: "Statement",
        url: STATEMENT_BASE_64_PREFIX + data.StatementContent,
      };

      try {
        const ShareResponse = await Share.open(shareOptions);
        warn("Result =>", JSON.stringify(ShareResponse));
      } catch (error) {
        warn("sharePdfBase64 Error =>", JSON.stringify(error));
      }
    }
  };

  const bottomButtonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    marginBottom: theme.spacing["16p"],
  }));

  const fullIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60-60%"],
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    height: 32,
    width: 32,
  }));

  const headerFullStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: fullPreviewMode ? theme.palette.transparent : theme.palette["supportBase-15"],
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60" insets={["left", "right"]}>
        <SafeAreaView style={headerFullStyle}>
          <NavHeader
            title={t("Statements.PreviewStatementScreen.title")}
            withBackButton={!fullPreviewMode}
            variant={fullPreviewMode ? "black" : "angled"}
            end={
              <Pressable style={fullIconContainerStyle} onPress={() => setFullPreviewMode(!fullPreviewMode)}>
                {fullPreviewMode ? <CloseIcon /> : <FullScreenIcon width={20} height={20} />}
              </Pressable>
            }
          />
        </SafeAreaView>

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
