import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";

import CaseListItem from "../components/CaseListItem";
import { useMyCases } from "../hooks/query-hooks";
import { isCaseActive } from "../utils";

export default function MyCasesLandingScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { data, isLoading, isError } = useMyCases();
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState<"active" | "resolved">("active");

  useEffect(() => {
    setIsErrorModalVisible(isError);
  }, [isError]);

  const handleOnPress = (transactionRef: string) => {
    navigation.navigate("PaymentDisputes.CaseDetailsScreen", {
      transactionRef,
    });
  };

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
      data?.DisputeCases.filter(element =>
        currentTab === "active" ? isCaseActive(element.CaseStatus) : !isCaseActive(element.CaseStatus)
      ),
    [data, currentTab]
  );

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader />
        {isLoading ? (
          <View style={styles.loading}>
            <FullScreenLoader />
          </View>
        ) : (
          <>
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
                    onPress={() => handleOnPress(element.Transaction.TransactionRef)}
                  />
                ))
              )}
            </ContentContainer>
          </>
        )}
      </Page>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={() => {
          setIsErrorModalVisible(false);
          delayTransition(() => navigation.goBack());
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
  loading: {
    flex: 1,
    marginTop: -49,
  },
});
