import React from "react";
import { useTranslation } from "react-i18next";
import { TextStyle, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CarouselImage, CarouselText } from "../components";
import { data } from "../mocks/entryPointData";

export default function EntryPointScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

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

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
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
