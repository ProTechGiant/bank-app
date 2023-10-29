import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { PrintIcon } from "@/assets/icons";
import { ShareDocumentIcon } from "@/assets/icons/ShareDocumentIcon";
import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import TermsAndConditionDetails from "@/components/TermsAndConditionDetails";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TermsAndConditionContainer } from "@/types/Content";
import { handleExportStatement } from "@/utils/export-pdf";

import Stack from "../Stack";

const PDF_BASE_64_PREFIX = "data:application/pdf;base64,";

interface TermsAndConditionsModalProps {
  termsData: TermsAndConditionContainer | undefined;
}
export default function TermsAndConditionsPage({ termsData }: TermsAndConditionsModalProps) {
  const { t } = useTranslation();

  const navigation = useNavigation();

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

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-40"],
    marginHorizontal: -theme.spacing["20p"],
    marginVertical: theme.spacing["20p"],
  }));

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

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />

        {termsSections === undefined ? (
          <FlexActivityIndicator />
        ) : (
          <ContentContainer isScrollView>
            <View style={containerStyle}>
              <Typography.Text color="neutralBase+30" weight="medium" size="title1">
                {t("TermsAndConditionsModal.title")}
              </Typography.Text>
            </View>

            {termsSections.map((term, index) => (
              <Typography.Text key={index} size="callout" color="primaryBase-40" weight="medium">
                {`${index + 1}. ${term.Title}`}
              </Typography.Text>
            ))}

            <View style={separatorStyle} />

            {termsSections.map((term, index) => {
              return <TermsAndConditionDetails key={index} title={term.Title} data={term.Bodies} index={index + 1} />;
            })}
          </ContentContainer>
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
