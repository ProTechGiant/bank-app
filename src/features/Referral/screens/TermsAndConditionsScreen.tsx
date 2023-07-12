import React from "react";
import { useTranslation } from "react-i18next";

import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import TermsAndConditionDetails from "@/components/TermsAndConditionDetails";
import Typography from "@/components/Typography";
import { useContentTermsAndCondition } from "@/hooks/use-content";
import useNavigation from "@/navigation/use-navigation";

export default function TermsAndConditionsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const termsAndConditionData = useContentTermsAndCondition();
  const termsSections = termsAndConditionData?.data?.TermsSections;

  return (
    <Page>
      <NavHeader
        withBackButton={false}
        title={t("Referral.TermsAndConditionsScreen.navTitle")}
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
      />
      <ContentContainer isScrollView>
        <Typography.Header weight="bold" size="medium">
          {t("Referral.TermsAndConditionsScreen.pageTitle")}
        </Typography.Header>
        {termsSections === undefined ? (
          <FlexActivityIndicator />
        ) : (
          termsSections.map((term, index) => (
            <TermsAndConditionDetails key={index} title={term.Title} data={term.Bodies} typeOfTerms="Referral" />
          ))
        )}
      </ContentContainer>
    </Page>
  );
}
