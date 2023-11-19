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
import { CardTypes, TransactionItem } from "../types";
import { mockTransactions } from "./../mocks/index";

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { allInOneCardStatus, allInOneCardType } = useAuthContext();
  const navigation = useNavigation();
  const tabFeed = t("AllInOneCard.Dashboard.feed");
  const tabCurrencies = t("AllInOneCard.Dashboard.currencies");
  const [value, setValue] = useState(tabFeed);
  const { width } = useWindowDimensions();
  // TODO: activate card state will be managed from api in next build cycle
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showCardActivation, setShowCardActivation] = useState<boolean>(allInOneCardStatus === "inActive");
  const isFocused = useIsFocused();

  useEffect(() => {
    if (allInOneCardStatus === "active") {
      setShowCardActivation(false);
    } else if (allInOneCardStatus === "inActive") {
      setShowCardActivation(true);
    } else {
      navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.EntryPoint" });
    }
  }, [allInOneCardStatus, isFocused]);

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

  const handleTransactionSeeMore = () => {
    // TOOD : handle it when required screen is made
  };

  const handleOnRewardsPress = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", {
      screen: "AllInOneCard.Rewards",
      params: { cardType: allInOneCardType },
    });
  };

  const handleActivateCard = () => {
    navigation.navigate("AllInOneCard.AllInOneCardStack", { screen: "AllInOneCard.CreatePINScreen" });
  };

  const transactions = mockTransactions;

  return (
    <Page insets={["left", "right", "top"]} backgroundColor="neutralBase-60">
      <NavHeader
        withBackButton={false}
        title={t("AllInOneCard.Dashboard.title")}
        end={
          <Pressable onPress={handleNavigateToSettings}>
            <SettingIcon />
          </Pressable>
        }
        backgroundColor="#EC5F48"
      />
      <ScrollView style={showCardActivation ? scrollStyle : {}}>
        <View pointerEvents={showCardActivation ? "none" : "auto"}>
          <AllInCardPlaceholder variant={allInOneCardType} width="90%" />
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
                transactions={transactions as TransactionItem[]}
              />
              {allInOneCardType === CardTypes.NERA ? <UpgradeToNeraPlusCard /> : null}
            </>
          ) : (
            <MyCurrencies />
          )}
        </View>
      </ScrollView>
      {showCardActivation ? (
        <Pressable style={styles.activateCardStyle} onPress={handleActivateCard}>
          <ActivateCard label={t("AllInOneCard.Dashboard.activateCard")} backgroundColor="neutralBase-60" />
        </Pressable>
      ) : null}
    </Page>
  );
}
