import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { Stack } from "@/components";
import Chip from "@/components/Chip";
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
import { CasesCategoriesEnum, TabsTypeEnum } from "../types";

export default function MyCasesLandingScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const categories = Object.values(CasesCategoriesEnum);

  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabsTypeEnum>(TabsTypeEnum.ACTIVE);
  const [categorySelected, setCategorySelected] = useState<CasesCategoriesEnum>(CasesCategoriesEnum.ALL);

  const { data, isLoading, isError } = useMyCases(categorySelected);

  useEffect(() => {
    setIsErrorModalVisible(isError);
  }, [isError]);

  const whiteColor = useThemeStyles<string>(theme => theme.palette.transparent);

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));

  const segmentedControlStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    rowGap: theme.spacing["16p"],
  }));

  const visibleItems = useMemo(
    () =>
      data?.Cases?.filter(element =>
        //FIXME is this the right condition ?
        currentTab === "active" ? element.Resolution !== true : element.Resolution === true
      ),
    [data, currentTab]
  );

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader title={t("PaymentDisputes.MyCasesLandingScreen.title")} />
        <StatusBar barStyle="dark-content" backgroundColor={whiteColor} />
        {isLoading ? (
          <View style={styles.loading}>
            <FullScreenLoader />
          </View>
        ) : (
          <>
            <View style={headerStyle}>
              <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                <Stack direction="horizontal">
                  <SegmentedControl onPress={value => setCategorySelected(value)} value={categorySelected}>
                    {categories.map((category: CasesCategoriesEnum) => (
                      <SegmentedControl.Item value={category}>{category}</SegmentedControl.Item>
                    ))}
                  </SegmentedControl>
                </Stack>
              </ScrollView>
              <Stack direction="horizontal" style={segmentedControlStyle} gap="8p">
                <Chip
                  isDark={currentTab === TabsTypeEnum.ACTIVE}
                  title={t("PaymentDisputes.MyCasesLandingScreen.active")}
                  isRemovable={false}
                  isSelected={currentTab === TabsTypeEnum.ACTIVE}
                  onPress={() => setCurrentTab(TabsTypeEnum.ACTIVE)}
                />
                <Chip
                  isDark={currentTab === TabsTypeEnum.RESOLVED}
                  title={t("PaymentDisputes.MyCasesLandingScreen.resolved")}
                  isRemovable={false}
                  isSelected={currentTab === TabsTypeEnum.RESOLVED}
                  onPress={() => setCurrentTab(TabsTypeEnum.RESOLVED)}
                />
              </Stack>
            </View>
            <ContentContainer isScrollView style={contentContainerStyle}>
              {isLoading ? (
                <FlexActivityIndicator />
              ) : visibleItems === undefined || visibleItems.length < 1 ? (
                <View style={styles.empty}>
                  <Typography.Text color="neutralBase-20" size="title3" weight="medium">
                    {currentTab === "active"
                      ? t("PaymentDisputes.MyCasesLandingScreen.noActiveCases")
                      : t("PaymentDisputes.MyCasesLandingScreen.noResolvedCases")}
                  </Typography.Text>
                </View>
              ) : (
                visibleItems.map(element => <CaseListItem key={element.CaseNumber} data={element} />)
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
