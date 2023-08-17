import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Share, { ShareOptions } from "react-native-share";

import { CloseIcon, FullScreenIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

import { PreviewStatementPDF } from "../components";
import { useDownloadStatement } from "../hooks/query-hooks";
import { STATEMENT_BASE_64_STRING } from "../mocks/AccessStatementData";
import { StatementsStackParams } from "../StatementsStack";

export default function PreviewStatementScreen() {
  const [fullPreviewMode, setFullPreviewMode] = useState(false);
  const route = useRoute<RouteProp<StatementsStackParams, "Statements.PreviewStatementScreen">>();
  const documentId = route.params?.documentId;

  const { data } = useDownloadStatement(documentId);
  const { t } = useTranslation();

  const handleExportStatement = async () => {
    const shareOptions: ShareOptions = {
      title: "Statement",
      //TODO: will change it to url once backend is ready
      url: data?.StatementContent || STATEMENT_BASE_64_STRING,
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      warn("Result =>", JSON.stringify(ShareResponse));
    } catch (error) {
      warn("sharePdfBase64 Error =>", JSON.stringify(error));
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
          {/* {data?.StatementContent !== undefined ? ( TODO: will uncomment once api starts working*/}
          <PreviewStatementPDF
            fullPreviewMode={fullPreviewMode}
            source={{ uri: data?.StatementContent || STATEMENT_BASE_64_STRING }} //TODO: Will remove fallback when API will be available
          />
          {/* ) : null} */}
          {!fullPreviewMode ? (
            <View style={bottomButtonContainerStyle}>
              <Button onPress={handleExportStatement}>{t("Statements.PreviewStatementScreen.exportAsPDF")}</Button>
            </View>
          ) : null}
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}
