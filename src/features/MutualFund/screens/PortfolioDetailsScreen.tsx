import { RouteProp, useRoute } from "@react-navigation/native";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Platform, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Typography } from "@/components";
import Button from "@/components/Button";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { HeaderContent, PortfolioDetailsHeaderContent } from "../components";
import DetailsCard from "../components/DetailsCard";
import { usePortfolioDetails } from "../hooks/query-hooks";
import { MutualFundStackParams } from "../MutualFundStack";

export default function PortfolioDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const { params } = useRoute<RouteProp<MutualFundStackParams, "MutualFund.PortfolioDetails">>();
  const { data: PortfolioDetails } = usePortfolioDetails();

  const H_MIN_HEIGHT = 52 + insets.top + 8;
  const H_MAX_HEIGHT = Platform.OS === "android" ? 529 + insets.top : 480 + insets.top;
  const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

  const handleOnPressProduct = () => {
    navigation.navigate("MutualFund.MutualFundDetailsScreen");
  };

  const handleOnDiscoverMutualFund = () => {
    navigation.navigate("MutualFund.DiscoverProducts");
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
        <HeaderContent headerTitle={params.PortfolioPerformanceName ?? "Portfolio"} showInfoIndicator={true}>
          <PortfolioDetailsHeaderContent
            portfolioDetails={PortfolioDetails}
            portfolioChartLine={params.PortfolioPerformanceList}
            PortfolioPerformanceLineChartColorIndex={params.PortfolioPerformanceLineChartColorIndex}
          />
        </HeaderContent>
        <View style={titleContainerStyle}>
          <Typography.Text size="title2" weight="medium">
            {t("MutualFund.PortfolioDetailsScreen.subTitle")}
          </Typography.Text>
        </View>
      </Animated.View>
      {PortfolioDetails !== undefined ? (
        <Animated.ScrollView
          style={containerStyle}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}>
          <Pressable onPress={handleOnPressProduct}>
            <View style={contentContainerStyle}>
              {PortfolioDetails.PortfolioHoldingList.map((PortfolioDetail, index) => (
                <DetailsCard
                  key={index}
                  title={PortfolioDetail.ProductName}
                  investedValue={PortfolioDetail.InvestedValue}
                  isDown={PortfolioDetail.YTD > 0}
                  navValue={PortfolioDetail.NAV}
                  ytdValue={PortfolioDetail.YTD}
                  averageCostValue={PortfolioDetail.AvargeCoast}
                  unitsValue={PortfolioDetail.Units}
                />
              ))}
              <Button onPress={handleOnDiscoverMutualFund}>
                {t("MutualFund.PortfolioDetailsScreen.discoverButton")}
              </Button>
              <Button variant="tertiary" onPress={handleOnViewFoundPress}>
                {t("MutualFund.PortfolioDetailsScreen.viewFundButton")}
              </Button>
            </View>
          </Pressable>
        </Animated.ScrollView>
      ) : (
        <></>
      )}
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
