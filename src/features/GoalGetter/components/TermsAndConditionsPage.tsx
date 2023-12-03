import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { PrintIcon } from "@/assets/icons";
import { ShareDocumentIcon } from "@/assets/icons/ShareDocumentIcon";
import { Stack } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import { LoadingErrorNotification } from "@/components/LoadingError";
import Page from "@/components/Page";
import TermsAndConditionDetails from "@/components/TermsAndConditionDetails";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { TermsAndConditionContainer } from "@/types/Content";
import { handleExportStatement } from "@/utils/export-pdf";

const PDF_BASE_64_PREFIX = "data:application/pdf;base64,";

interface TermsAndConditionsModalProps {
  termsData: TermsAndConditionContainer | undefined;
  isLoading: boolean;
  refetch: () => void;
}
export default function TermsAndConditionsPage({ termsData, isLoading, refetch }: TermsAndConditionsModalProps) {
  const { t } = useTranslation();

  const [isLoadingErrorNotificationVisible, setIsLoadingErrorNotificationVisible] = useState<boolean>(false);

  useEffect(() => {
    if (termsData === undefined && !isLoading) setIsLoadingErrorNotificationVisible(true);
  }, [termsData, isLoading]);

  const termsSections = termsData?.TermsSections;
  const termsId = termsData?.TermsID;

  const handleOnSharePress = async () => {
    await shareTermsAndConditions("string");
  };

  const handleOnPrintPress = async () => {
    await shareTermsAndConditions("pdf");
  };

  const shareTermsAndConditions = async (type: "pdf" | "string") => {
    const termsAsString =
      termsSections
        ?.map((section, index) => `${index + 1} . ${section.Title}\n ${section.Bodies.map(body => body.Body)}\n`)
        .join("\n") ?? "";

    await handleExportStatement(
      {
        name: `Croatia Terms And Conditions ${termsId}`,
        type: "pdf",
        content: termsAsString,
      },
      type === "pdf" ? PDF_BASE_64_PREFIX : ""
    );
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["20p"],
  }));

  const footerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["16p"],
    width: "100%",
    backgroundColor: theme.palette["neutralBase-60"],
    bottom: 0,
    justifyContent: "space-between",
  }));

  const termsStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.complimentBase,
    minHeight: "95%",
    width: "100%",
  }));

  return (
    <SafeAreaProvider style={termsStyle}>
      <Page backgroundColor="neutralBase-60">
        {isLoading ? (
          <FlexActivityIndicator />
        ) : termsSections !== undefined ? (
          <ContentContainer isScrollView>
            <View style={containerStyle}>
              <Typography.Text color="neutralBase+30" weight="medium" size="title1">
                {t("TermsAndConditionsModal.title")}
              </Typography.Text>
            </View>

            {termsSections.map((term, index) => (
              <Typography.Text key={index} size="callout" color="complimentBase" weight="medium">
                {`${index + 1}. ${term.Title}`}
              </Typography.Text>
            ))}

            {termsSections.map((term, index) => {
              return <TermsAndConditionDetails key={index} title={term.Title} data={term.Bodies} index={index + 1} />;
            })}
          </ContentContainer>
        ) : (
          <LoadingErrorNotification
            isVisible={isLoadingErrorNotificationVisible}
            onClose={() => setIsLoadingErrorNotificationVisible(false)}
            onRefresh={refetch}
          />
        )}
        <Stack direction="horizontal" style={footerStyle}>
          <Pressable onPress={handleOnPrintPress}>
            <PrintIcon />
          </Pressable>
          <Pressable onPress={handleOnSharePress}>
            <ShareDocumentIcon />
          </Pressable>
        </Stack>
      </Page>
    </SafeAreaProvider>
  );
}
