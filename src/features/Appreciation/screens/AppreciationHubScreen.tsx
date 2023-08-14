import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { FilterIcon } from "@/assets/icons";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import { useThemeStyles } from "@/theme";

import { AllAppreciation, RedeemedAppreciation } from "../components";
import { TabsTypes } from "../types";

export default function AppreciationHubScreen() {
  const [currentTab, setCurrentTab] = useState<TabsTypes>(TabsTypes.ALL);

  const { t } = useTranslation();

  const handleOnFiltersModalVisiblePress = () => {
    //TODO Handle Filter Modal
  };

  const renderAppreciationScreen = () => {
    if (currentTab === TabsTypes.ALL) {
      return <AllAppreciation />;
    } else if (currentTab === TabsTypes.REDEEMED) {
      return <RedeemedAppreciation />;
    }
  };

  const segmentedControlStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={t("Appreciation.HubScreen.title")}
        end={<NavHeader.IconEndButton icon={<FilterIcon />} onPress={handleOnFiltersModalVisiblePress} />}
      />
      <View style={segmentedControlStyle}>
        <SegmentedControl onPress={value => setCurrentTab(value)} value={currentTab}>
          <SegmentedControl.Item value={TabsTypes.ALL}>{t("Appreciation.HubScreen.all")}</SegmentedControl.Item>
          <SegmentedControl.Item value={TabsTypes.REDEEMED}>
            {t("Appreciation.HubScreen.redeemed")}
          </SegmentedControl.Item>
        </SegmentedControl>
      </View>
      {renderAppreciationScreen()}
    </Page>
  );
}
