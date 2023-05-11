import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import CaseListItem from "../components/CaseListItem";
import { useMyCases } from "../hooks/query-hooks";
import { isCaseActive } from "../utils";

export default function MyCasesLandingScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const cases = useMyCases();
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState<"active" | "resolved">("active");

  useEffect(() => {
    setIsErrorModalVisible(cases.isError);
  }, [cases.isError]);

  const handleOnPress = (caseNumber: string, source: string) =>
    navigation.navigate("PaymentDisputes.CaseDetailsScreen", {
      caseNumber: "35665", // TODO: BE provided a hardcoded ID
      source: source,
    });

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const segmentedControlStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
    marginTop: theme.spacing["24p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    rowGap: theme.spacing["16p"],
  }));

  const visibleItems = useMemo(
    () =>
      cases.data?.DisputeCases.filter(element =>
        currentTab === "active" ? isCaseActive(element.CaseStatus) : !isCaseActive(element.CaseStatus)
      ),
    [cases.data, currentTab]
  );

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader />
        <View style={headerStyle}>
          <Typography.Text color="neutralBase+30" size="title1" weight="medium">
            {t("PaymentDisputes.MyCasesLandingScreen.title")}
          </Typography.Text>
          <View style={segmentedControlStyle}>
            <SegmentedControl onPress={value => setCurrentTab(value)} value={currentTab}>
              <SegmentedControl.Item value="active">
                {t("PaymentDisputes.MyCasesLandingScreen.active")}
              </SegmentedControl.Item>
              <SegmentedControl.Item value="resolved">
                {t("PaymentDisputes.MyCasesLandingScreen.resolved")}
              </SegmentedControl.Item>
            </SegmentedControl>
          </View>
        </View>
        <ContentContainer isScrollView style={contentContainerStyle}>
          {visibleItems === undefined ? (
            <FlexActivityIndicator />
          ) : visibleItems.length < 1 ? (
            <View style={styles.empty}>
              <Typography.Text color="neutralBase-20" size="title3" weight="medium">
                {currentTab === "active"
                  ? t("PaymentDisputes.MyCasesLandingScreen.noActiveCases")
                  : t("PaymentDisputes.MyCasesLandingScreen.noResolvedCases")}
              </Typography.Text>
            </View>
          ) : (
            visibleItems.map(element => (
              <CaseListItem
                key={element.CaseNumber}
                data={element}
                onPress={() => handleOnPress(element.CaseNumber, element.Transaction.Source)}
              />
            ))
          )}
        </ContentContainer>
      </Page>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={() => {
          setIsErrorModalVisible(false);
          setTimeout(() => navigation.goBack(), 300);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
