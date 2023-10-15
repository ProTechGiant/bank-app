import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, useWindowDimensions, View, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";
import SegmentedControlItem from "@/components/SegmentedControl/SegmentedControlItem";
import { useThemeStyles } from "@/theme";

import { SettingIcon } from "../assets/icons";
import { ActivateCard, Benefits, Rewards } from "../components";
import AllInCardPlaceholder from "../components/AllInCardPlaceholder";
import TransactionSection from "../components/TransactionSection";
import { mockTransactions } from "../mocks";
import { TransactionItem } from "../types";

export default function DashboardScreen() {
  const { t } = useTranslation();
  const tabFeed = t("AllInOneCard.Dashboard.feed");
  const tabCurrencies = t("AllInOneCard.Dashboard.currencies");
  const [value, setValue] = useState(tabFeed);
  const { width } = useWindowDimensions();
  // TODO: activate card state will be managed from api in next build cycle
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showCardActivation, setShowCardActivation] = useState<boolean>(false);

  const dividerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: theme.spacing["4p"],
    backgroundColor: theme.palette["neutralBase-40"],
    width: "100%",
    marginTop: theme.spacing["16p"],
  }));

  const activateCardStyle = useThemeStyles<ViewStyle>(() => ({
    position: "absolute",
    top: "20%",
    start: width / 2.5,
  }));

  const scrollStyle = useThemeStyles<ViewStyle>(() => ({
    opacity: showCardActivation ? 0.5 : 1,
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

  const transactions = mockTransactions;

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        withBackButton={false}
        title={t("AllInOneCard.Dashboard.title")}
        end={
          <Pressable>
            <SettingIcon />
          </Pressable>
        }
        backgroundColor="#EC5F48"
      />
      <ScrollView style={scrollStyle}>
        <AllInCardPlaceholder variant="nera" width="90%" />
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
        <Benefits />
        <Rewards />
        <TransactionSection
          onPressSeeMore={handleTransactionSeeMore}
          transactions={transactions as TransactionItem[]}
        />
      </ScrollView>
      {showCardActivation ? (
        <View style={activateCardStyle}>
          <ActivateCard label={t("AllInOneCard.Dashboard.activateCard")} backgroundColor="neutralBase-60" />
        </View>
      ) : null}
    </Page>
  );
}
