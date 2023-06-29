import React from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import TermsAndConditionDetails from "@/components/TermsAndConditionDetails";
import Typography from "@/components/Typography";
import { useContentTermsAndCondition } from "@/hooks/use-content";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function TermsAndConditionsModal() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const termsAndConditionData = useContentTermsAndCondition();
  const termsSections = termsAndConditionData?.data?.TermsSections;

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["24p"],
  }));

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-30"],
    marginHorizontal: -theme.spacing["20p"],
    marginVertical: theme.spacing["20p"],
  }));

  return (
    <SafeAreaProvider>
      <Page>
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
        <ContentContainer isScrollView>
          <View style={titleContainerStyle}>
            <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
              {t("PaymentDisputes.TermsAndConditionsModal.title")}
            </Typography.Text>
          </View>
          {termsSections === undefined ? (
            <FlexActivityIndicator />
          ) : (
            <>
              {termsSections.map((term, index) => (
                <Typography.Text key={index} size="callout" color="primaryBase" weight="medium">
                  {`${index + 1}. ${term.Title}`}
                </Typography.Text>
              ))}
              <View style={separatorStyle} />
              {termsSections.map((term, index) => {
                return <TermsAndConditionDetails key={index} title={term.Title} data={term.Bodies} index={index + 1} />;
              })}
            </>
          )}
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}
