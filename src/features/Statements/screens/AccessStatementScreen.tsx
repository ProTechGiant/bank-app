import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, useWindowDimensions, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AccessCustomDateStatementList, AccessMonthlyStatmentsList } from "../components";
import { TabsTypes } from "../types";

export default function AccessStatementScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { height: screenHeight } = useWindowDimensions();
  const [currentTab, setCurrentTab] = useState<TabsTypes>(TabsTypes.MONTHLY);

  const handleOnRequestStatement = () => {
    navigation.navigate("Statements.AccessStatementScreen");
  };

  const renderScreen = () => {
    if (currentTab === TabsTypes.MONTHLY) {
      return <AccessMonthlyStatmentsList />;
    } else if (currentTab === TabsTypes.CUSTOM_DATE) {
      return <AccessCustomDateStatementList />;
    }
  };

  const segmentedControlStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
    marginTop: theme.spacing["24p"],
  }));

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["supportBase-15"],
  }));

  const mainContainer = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    position: "relative",
    height: screenHeight * 0.87,
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    bottom: theme.spacing["12p"],
    position: "absolute",
    width: "100%",
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: 10,
    backgroundColor: theme.palette["neutralBase-40"],
  }));

  return (
    <Page>
      <View style={headerStyle}>
        <NavHeader title={t("Statements.AccessStatements.title")} />
      </View>
      <SafeAreaView style={mainContainer}>
        <View style={segmentedControlStyle}>
          <SegmentedControl onPress={value => setCurrentTab(value)} value={currentTab}>
            <SegmentedControl.Item value={TabsTypes.MONTHLY}>
              {t("Statements.AccessStatements.monthly")}
            </SegmentedControl.Item>
            <SegmentedControl.Item value={TabsTypes.CUSTOM_DATE}>
              {t("Statements.AccessStatements.customDate")}
            </SegmentedControl.Item>
          </SegmentedControl>
        </View>

        {renderScreen()}
      </SafeAreaView>

      <View style={buttonContainerStyle}>
        <Button onPress={handleOnRequestStatement}>{t("Statements.AccessStatements.RequestStatmentButtonText")}</Button>
      </View>
    </Page>
  );
}
