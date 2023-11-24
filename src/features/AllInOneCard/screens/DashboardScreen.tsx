import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";
import SegmentedControlItem from "@/components/SegmentedControl/SegmentedControlItem";
import { useAuthContext } from "@/contexts/AuthContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { SettingIcon } from "../assets/icons";
import { ActivateCard, Benefits, MyCurrencies, Rewards, UpgradeToNeraPlusCard } from "../components";
import AllInCardPlaceholder from "../components/AllInCardPlaceholder";
import TransactionSection from "../components/TransactionSection";
import { useAioCardDashboardDetail, useGetCardDetails } from "../hooks/query-hooks";
import { CardTypes } from "../types";

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { allInOneCardStatus, allInOneCardType } = useAuthContext();
  const navigation = useNavigation();
  const tabFeed = t("AllInOneCard.Dashboard.feed");
  const tabCurrencies = t("AllInOneCard.Dashboard.currencies");
  const [value, setValue] = useState(tabFeed);
  const { width } = useWindowDimensions();
  // TODO: activate card state will be managed from api in next build cycle
  const [showCardActivation, setShowCardActivation] = useState<boolean>(allInOneCardStatus === "inActive");
  const isFocused = useIsFocused();
  //TODO : Satic value  will be removed when api works with all ids
  const { data: cardBalance } = useGetCardDetails({ id: "1", type: "neraPlus" });
  //TODO : Satic value  will be removed when api works with all ids
  const { data: cardDetail, isLoading: isAioCardLoading } = useAioCardDashboardDetail({
    ProductType: "366_SAR_001",
    NoOfTransaction: "5",
    IncludeTransactionsList: "true",
  });

  useEffect(() => {
    if (allInOneCardStatus === "active") {
      setShowCardActivation(false);
    } else if (allInOneCardStatus === "inActive") {
      setShowCardActivation(true);
    } else {
      navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.EntryPoint" });
    }
  }, [allInOneCardStatus, isFocused, navigation]);

  const handleNavigateToSettings = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.SettingsScreen" });
  };

  const dividerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: theme.spacing["4p"],
    backgroundColor: theme.palette["neutralBase-40"],
    width: "100%",
    marginTop: theme.spacing["16p"],
  }));

  const styles = StyleSheet.create({
    activateCardStyle: {
      position: "absolute",
      start: width / 2.9,
      top: "20%",
    },
  });
  const scrollStyle = useThemeStyles<ViewStyle>(() => ({
    opacity: 0.5,
  }));

  const styleSegmentedControl = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const handleUserSegment = (selectedValue: string) => {
    setValue(selectedValue);
  };

  const handleTransactionSeeMore = () =>
    navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.AllTransactionsScreen" });

  const handleOnRewardsPress = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", {
      screen: "AllInOneCard.Rewards",
      params: { cardType: allInOneCardType },
    });
  };

  const handleActivateCard = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.CreatePINScreen" });
  };

  return (
    <Page insets={["left", "right", "top"]} backgroundColor="neutralBase-60" testID="AllInOneCard.DashboardScreen:Page">
      <NavHeader
        withBackButton={false}
        title={t("AllInOneCard.Dashboard.title")}
        end={
          <Pressable onPress={handleNavigateToSettings}>
            <SettingIcon />
          </Pressable>
        }
        variant="white"
        backgroundColor="#1E1A25"
        testID="AllInOneCard.DashboardScreen:NavHeader"
      />
      <ScrollView style={showCardActivation ? scrollStyle : {}}>
        <View pointerEvents={showCardActivation ? "none" : "auto"}>
          <AllInCardPlaceholder variant={allInOneCardType} cardWidth="90%" visaCardData={cardBalance} />
          <View style={dividerStyle} />
          <View style={styleSegmentedControl}>
            <SegmentedControl value={value} onPress={selectedValue => handleUserSegment(selectedValue)}>
              <SegmentedControlItem value={tabFeed}>{tabFeed}</SegmentedControlItem>
              {/* TODO : hasUpdate Will be managed from api in next build cycle.currently we are just making ui  */}
              <SegmentedControlItem value={tabCurrencies} hasUpdate={true}>
                {tabCurrencies}
              </SegmentedControlItem>
            </SegmentedControl>
          </View>
          {value === tabFeed ? (
            <>
              <Benefits />
              <Rewards onPress={handleOnRewardsPress} />
              <TransactionSection
                onPressSeeMore={handleTransactionSeeMore}
                transactions={cardDetail?.Cards[0].Transaction}
                isLoading={isAioCardLoading}
              />
              {allInOneCardType === CardTypes.NERA ? <UpgradeToNeraPlusCard /> : null}
            </>
          ) : (
            <MyCurrencies />
          )}
        </View>
      </ScrollView>
      {showCardActivation ? (
        <Pressable
          style={styles.activateCardStyle}
          onPress={handleActivateCard}
          testID="AllInOneCard.DashboardScreen:CardActivationButton">
          <ActivateCard label={t("AllInOneCard.Dashboard.activateCard")} backgroundColor="neutralBase-60" />
        </Pressable>
      ) : null}
    </Page>
  );
}
