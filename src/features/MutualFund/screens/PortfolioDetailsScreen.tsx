import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Animated, Platform, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { EmptyInvestments, HeaderContent, OrderItem, PortfolioDetailsHeaderContent } from "../components";
import { useGetProductInfo } from "../hooks/query-hooks";

export default function PortfolioDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const [selectedPortfolioID, setSelectedPortfolioID] = useState(2776744);
  const [selectedPortfolioCode, setSelectedPortfolioCode] = useState();

  const { data: cardRisk, refetch, isLoading } = useGetProductInfo(selectedPortfolioID);
  const PortfolioDetails = cardRisk?.Orders;

  useEffect(() => {
    refetch();
  }, [selectedPortfolioID]);

  const handlePortfolioSelect = (selectedId: number) => {
    setSelectedPortfolioID(selectedId);
  };
  const handlePortfolioSelectCode = (selectedCode: string) => {
    setSelectedPortfolioCode(selectedCode);
  };

  const H_MIN_HEIGHT = 52 + insets.top + 8;
  const H_MAX_HEIGHT = Platform.OS === "android" ? 270 + insets.top : 200 + insets.top;

  const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

  const handleOnPressProduct = () => {
    const id = selectedPortfolioID;
    const code = selectedPortfolioCode;
    navigation.navigate("MutualFund.ProductDetails", { id, code });
  };

  const handleOnDiscoverMutualFund = () => {
    navigation.navigate("MutualFund.MutualFundDetailsScreen");
  };

  const handleOnPortfolioManagment = () => {
    const id = selectedPortfolioID;
    navigation.navigate("MutualFund.PortfolioManagmentScreen", { id });
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["12p"],
  }));

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["12p"],
    marginTop: theme.spacing["32p"],
    marginBottom: theme.spacing["20p"],
  }));

  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [2, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: H_MAX_HEIGHT + theme.spacing["24p"],
    paddingBottom: theme.spacing["16p"],
  }));

  const contentEmptyInvestmentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: H_MAX_HEIGHT + theme.spacing["48p"],
    paddingBottom: theme.spacing["16p"],
    flex: 1,
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["12p"],
  }));

  return isLoading ? (
    <Page>
      <Stack align="center" direction="vertical" gap="48p">
        <View>
          <ActivityIndicator size="large" style={{ flex: 2, alignContent: "center" }} />
        </View>
      </Stack>
    </Page>
  ) : (
    <Page backgroundColor="neutralBase-60" insets={["bottom"]} testID="MutualFund.PortfolioDetailsScreen:Page">
      <Animated.View style={[styles.animatedHeader, { height: headerScrollHeight }]}>
        <View>
          <HeaderContent
            headerTitle={t("MutualFund.PortfolioDetailsHeaderContent.Portfolios")}
            showInfoIndicator={true}
            onPress={handleOnPortfolioManagment}>
            <PortfolioDetailsHeaderContent
              onPortfolioSelect={handlePortfolioSelect}
              PortfoliosTotalValue={cardRisk?.PortfoliosTotalValue}
              PortfolioTotalValue={cardRisk?.PortfolioTotalValue}
              PortfolioMarketValue={cardRisk?.PortfolioMarketValue}
              PortfolioAvailableCash={cardRisk?.PortfolioAvailableCash}
              onPortfolioSelectCode={handlePortfolioSelectCode}
            />
          </HeaderContent>
        </View>
        <View style={titleContainerStyle}>
          <Typography.Text size="footnote" weight="regular">
            {t("MutualFund.ProductDetails.title")}
          </Typography.Text>
        </View>
      </Animated.View>
      {PortfolioDetails && PortfolioDetails.length > 0 ? (
        <Animated.ScrollView
          style={containerStyle}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}>
          <Stack direction="vertical" gap="16p" style={contentContainerStyle}>
            {PortfolioDetails.map((detail, index) => (
              <OrderItem
                key={`card - ${index}`}
                name={detail.ProductName}
                units={`${detail.Units}`}
                investedValue={`${detail.InvestmentAmount}`}
                risk={detail.Risk}
                expectedReturn={`${detail.Ytd}`}
                onPress={handleOnPressProduct}
              />
            ))}
          </Stack>
        </Animated.ScrollView>
      ) : (
        <Animated.ScrollView
          style={containerStyle}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}>
          <View style={contentEmptyInvestmentStyle}>
            <EmptyInvestments />
          </View>
        </Animated.ScrollView>
      )}
      <View style={buttonContainerStyle}>
        <Button onPress={handleOnDiscoverMutualFund} testID="MutualFund.PortfolioDetailsScreen:Button">
          {t("MutualFund.ProductDetails.addNewFundButton")}
        </Button>
      </View>
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
