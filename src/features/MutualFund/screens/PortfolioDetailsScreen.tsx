import { RouteProp, useRoute } from "@react-navigation/native";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Platform, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Typography } from "@/components";
import Button from "@/components/Button";
import Page from "@/components/Page";
import { useThemeStyles } from "@/theme";

import { HeaderContent, PortfolioDetailsHeaderContent } from "../components";
import DetailsCard from "../components/DetailsCard";
import { ENTRY_POINT } from "../mocks/entryPoint";
import { Details_Data } from "../mocks/mockData";
import { MutualFundStackParams } from "../MutualFundStack";

export default function PortfolioDetailsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const { params } = useRoute<RouteProp<MutualFundStackParams, "MutualFund.PortfolioDetails">>();

  const H_MIN_HEIGHT = 52 + insets.top + 8;
  const H_MAX_HEIGHT = Platform.OS === "android" ? 529 + insets.top : 480 + insets.top;
  const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

  const handleOnDiscoverPress = () => {
    //TODO: This page not ready yet, so i let it as a comment
  };
  const handleOnViewFoundPress = () => {
    //TODO: This page not ready yet, so i let it as a comment
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["12p"],
  }));

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["12p"],
    marginVertical: theme.spacing["20p"],
  }));

  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [2, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: H_MAX_HEIGHT + theme.spacing["16p"],
    paddingBottom: theme.spacing["16p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["bottom"]}>
      <Animated.View style={[styles.animatedHeader, { height: headerScrollHeight }]}>
        <HeaderContent
          headerTitle={ENTRY_POINT.numberOfProtfolios === 1 ? "Portfolio" : params.portfolioName}
          showInfoIndicator={true}>
          <PortfolioDetailsHeaderContent />
        </HeaderContent>
        <View style={titleContainerStyle}>
          <Typography.Text size="title2" weight="medium">
            {t("MutualFund.PortfolioDetailsScreen.subTitle")}
          </Typography.Text>
        </View>
      </Animated.View>
      <Animated.ScrollView
        style={containerStyle}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        <View style={contentContainerStyle}>
          {Details_Data.map((detail, index) => (
            <DetailsCard
              key={index}
              title={detail.title}
              investedValue={detail.investedValue}
              isDown={detail.isDown}
              navValue={detail.navValue}
              ytdValue={detail.ytdValue}
              averageCostValue={detail.averageCostValue}
              unitsValue={detail.unitsValue}
            />
          ))}
          <Button onPress={handleOnDiscoverPress}>{t("MutualFund.PortfolioDetailsScreen.discoverButton")}</Button>
          <Button variant="tertiary" onPress={handleOnViewFoundPress}>
            {t("MutualFund.PortfolioDetailsScreen.viewFundButton")}
          </Button>
        </View>
      </Animated.ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  animatedHeader: {
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: 0,
    width: "100%",
    zIndex: 999,
  },
});
