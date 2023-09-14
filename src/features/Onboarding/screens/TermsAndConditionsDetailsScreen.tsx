import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, ViewStyle } from "react-native";

import FullScreenLoader from "@/components/FullScreenLoader";
import HtmlWebView from "@/components/HtmlWebView/HtmlWebView";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useOpenLink from "@/hooks/use-open-link";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useGetCustomerTermsAndConditions } from "../hooks/query-hooks";
import { TermsSection } from "../types";

export default function TermsAndConditionsDetailsScreen() {
  const openLink = useOpenLink();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data, isLoading } = useGetCustomerTermsAndConditions("CroatiaTermsAndConditions");

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["32p"],
    marginVertical: theme.spacing["12p"],
  }));

  const titleStyles = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["20p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={true} testID="Onboarding.TermsAndConditionsDetailScreen:NavHeader" />
      <ScrollView style={containerStyles}>
        {isLoading ? (
          <FullScreenLoader />
        ) : data?.TermsSections?.length ? (
          data.TermsSections.map((section: TermsSection) => (
            <>
              <Stack key={section.TermsSectionId} direction="vertical">
                <Typography.Text weight="bold" size="footnote" color="primaryBase" style={titleStyles}>
                  {section.Title}
                </Typography.Text>
              </Stack>
              {section.Bodies.map(body => (
                <HtmlWebView key={body.TermsBodyId} html={body.Body} onLinkPress={url => openLink(url)} />
              ))}
            </>
          ))
        ) : (
          <NotificationModal
            title={t("Onboarding.TermsAndConditions.weAreSorry")}
            isVisible={true}
            onClose={() => navigation.navigate("Onboarding.TermsAndConditions")}
            message={t("Onboarding.TermsAndConditions.pleaseTryAgain")}
            variant="error"
          />
        )}
      </ScrollView>
    </Page>
  );
}
