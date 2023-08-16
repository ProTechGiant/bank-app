import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { FilterIcon } from "@/assets/icons";
import { AngleDownIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { AppreciationCard } from "../components";
import { AppreciationList } from "../mockData";
import { TabsTypes } from "../types";

export default function AppreciationHubScreen() {
  const { t } = useTranslation();

  const [currentTab, setCurrentTab] = useState<TabsTypes>(TabsTypes.ALL);

  const handleOnFiltersModalVisiblePress = () => {
    //TODO Handle Filter Modal
  };

  const segmentedControlStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["8p"],
  }));

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["4p"],
  }));

  const exploreContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing["12p"],
  }));

  const angleDownIconColor = useThemeStyles(theme => theme.palette.primaryBase);

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
      <ContentContainer isScrollView>
        <View style={titleContainerStyle}>
          <Typography.Text color="neutralBase+30" size="title3" weight="medium">
            {t("Appreciation.HubScreen.promoted")}
          </Typography.Text>
        </View>
        <AppreciationCard appreciation={AppreciationList[0]} isPromoted={true} />
        <View style={exploreContainerStyle}>
          <View style={titleContainerStyle}>
            <Typography.Text color="neutralBase+30" size="title3" weight="medium">
              {t("Appreciation.HubScreen.explore")}
            </Typography.Text>
          </View>
          <View>
            <View style={styles.dropdownContainer}>
              <Typography.Text color="primaryBase" size="footnote" weight="medium" align="center">
                {t("Appreciation.HubScreen.recommended")}
              </Typography.Text>
              <AngleDownIcon color={angleDownIconColor} />
            </View>
          </View>
        </View>
        {AppreciationList.map((appreciation, index) => {
          return <AppreciationCard appreciation={appreciation} key={index} />;
        })}
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
