import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, ViewStyle } from "react-native";

import { FilterIcon, InfoCircleIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import { useThemeStyles } from "@/theme";

import ConnectedServicesCardList from "../components/ConnectedServicesCardList";
import { connectedServicesHistoryMock, connectedServicesMock } from "../mock/ConnectedServices.mock";

enum TabsTypes {
  CURRENT = "Current",
  HISTORY = "History",
}

export default function ConnectedServicesScreen() {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState<TabsTypes>(TabsTypes.CURRENT);

  const handleOnFilter = () => {
    Alert.alert("fn is deprecated");
  };

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const subTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const segmentedControlStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
    flexDirection: "row",
  }));

  const iconWraperStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: "auto",
    marginRight: theme.spacing["20p"],
  }));

  return (
    <Page>
      <NavHeader withBackButton={true} />

      <ContentContainer>
        <Typography.Text size="title1" weight="medium" style={titleStyle}>
          {t("Settings.ConnectedServicesScreen.title")}
        </Typography.Text>
        <Typography.Text size="callout" weight="medium" color="neutralBase+10" style={subTitleStyle}>
          {t("Settings.ConnectedServicesScreen.subTitle")}
          <InfoCircleIcon />
        </Typography.Text>
        <Stack style={segmentedControlStyle} direction="horizontal">
          <SegmentedControl
            onPress={item => {
              setCurrentTab(item);
            }}
            value={currentTab}>
            <SegmentedControl.Item value={TabsTypes.CURRENT} fontWeight="regular">
              {t("Settings.ConnectedServicesScreen.current")}
            </SegmentedControl.Item>
            <SegmentedControl.Item value={TabsTypes.HISTORY} fontWeight="regular">
              {t("Settings.ConnectedServicesScreen.history")}
            </SegmentedControl.Item>
          </SegmentedControl>
          <Pressable onPress={handleOnFilter} style={iconWraperStyle}>
            <FilterIcon />
          </Pressable>
        </Stack>
        <Stack direction="vertical" style={styles.containerStyle} align="stretch">
          {currentTab === TabsTypes.CURRENT ? (
            <ConnectedServicesCardList connectedAccounts={connectedServicesMock} />
          ) : (
            <ConnectedServicesCardList connectedAccounts={connectedServicesHistoryMock} />
          )}
        </Stack>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    paddingBottom: 100,
  },
});
