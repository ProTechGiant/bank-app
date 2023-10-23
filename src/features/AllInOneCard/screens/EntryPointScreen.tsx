import React from "react";
import { useTranslation } from "react-i18next";
import { TextStyle, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { EntryPoint_1, EntryPoint_2, EntryPoint_3 } from "../assets/icons";
import { CarouselImage, CarouselText } from "../components";

export default function EntryPointScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const data = [
    {
      img: <EntryPoint_1 />,
      title: t("AllInOneCard.EntryPointScreen.rewardMethodTitle"),
      description: t("AllInOneCard.EntryPointScreen.rewardMethodDescription"),
      id: 1,
    },
    {
      img: <EntryPoint_2 />,
      title: t("AllInOneCard.EntryPointScreen.multipleCurrenciesTitle"),
      description: t("AllInOneCard.EntryPointScreen.multipleCurrenciesDescription"),
      id: 2,
    },
    {
      img: <EntryPoint_3 />,
      title: t("AllInOneCard.EntryPointScreen.streamingAppsTitle"),
      description: t("AllInOneCard.EntryPointScreen.streamingAppsDescription"),
      id: 3,
    },
  ];

  const containerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "space-between",
    marginTop: theme.spacing["48p"],
    padding: theme.spacing["20p"],
  }));

  const containerTextStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["20p"],
    zIndex: 100,
  }));

  const titleStyle = useThemeStyles<TextStyle>(theme => ({
    lineHeight: theme.typography.header._lineHeights.large,
  }));

  const handleExplore = () => {
    navigation.navigate("AllInOneCard.SelectCard");
  };

  const handleOnClose = () => {
    navigation.navigate("Home.DashboardScreen");
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={handleOnClose} />} />
      <View style={containerViewStyle}>
        <View style={containerTextStyle}>
          <Typography.Header size="large" weight="bold" align="center" style={titleStyle}>
            {t("AllInOneCard.EntryPointScreen.title")}
          </Typography.Header>
        </View>
        <CarouselImage data={data} />
        <CarouselText data={data} />
        <Button onPress={handleExplore}>{t("AllInOneCard.EntryPointScreen.buttonExplore")}</Button>
      </View>
    </Page>
  );
}
