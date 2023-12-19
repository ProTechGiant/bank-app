import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Platform, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

import { HeaderContent, MatchProductCard } from "../components";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { useBalanceAndContribution } from "../hooks/query-hooks";

export default function MatchProductsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setGoalContextState, targetAmount, targetDate } = useGoalGetterContext();
  const { mutateAsync: getTotalBalance, isLoading } = useBalanceAndContribution();
  const insets = useSafeAreaInsets();

  const H_MIN_HEIGHT = Platform.OS === "android" ? 74 + insets.top + 23 : +52 + insets.top + 8;

  const H_MAX_HEIGHT = Platform.OS === "android" ? 400 + insets.top : 360 + insets.top;

  const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  const highRiskColor = useThemeStyles(theme => theme.palette.complimentBase);
  const mediumRiskColor = useThemeStyles(theme => theme.palette.warningBase);

  const noRiskColor = useThemeStyles(theme => theme.palette["successBase-10"]);
  const lowRiskColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  const handleOnSelectCard = (card: string) => {
    if (selectedCard === card) {
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
    }
  };

  // ToDO: When Api is ready
  const productsData = [
    {
      type: "high-risk",
      color: highRiskColor,
      title: t("GoalGetter.SelectProductsScreen.temporaryValue.highRiskCard.title"),
      header: t("GoalGetter.SelectProductsScreen.temporaryValue.highRiskCard.header"),
      basedOn: t("GoalGetter.SelectProductsScreen.temporaryValue.highRiskCard.basedOn"),
      expectedTime: t("GoalGetter.SelectProductsScreen.temporaryValue.highRiskCard.expectedTime"),
      monthlyContribution: t("GoalGetter.SelectProductsScreen.temporaryValue.highRiskCard.monthlyContribution"),
      id: "1",
    },
    {
      type: "no-risk",
      color: noRiskColor,
      title: t("GoalGetter.SelectProductsScreen.temporaryValue.noRiskCard.title"),
      header: t("GoalGetter.SelectProductsScreen.temporaryValue.noRiskCard.header"),
      basedOn: t("GoalGetter.SelectProductsScreen.temporaryValue.noRiskCard.basedOn"),
      expectedTime: t("GoalGetter.SelectProductsScreen.temporaryValue.noRiskCard.expectedTime"),
      monthlyContribution: t("GoalGetter.SelectProductsScreen.temporaryValue.noRiskCard.monthlyContribution"),
      Investments: t("GoalGetter.SelectProductsScreen.temporaryValue.noRiskCard.Investments"),
      id: "2",
    },
    {
      type: "low-risk",
      color: lowRiskColor,
      title: t("GoalGetter.SelectProductsScreen.temporaryValue.lowRiskCard.title"),
      header: t("GoalGetter.SelectProductsScreen.temporaryValue.lowRiskCard.header"),
      basedOn: t("GoalGetter.SelectProductsScreen.temporaryValue.lowRiskCard.basedOn"),
      expectedTime: t("GoalGetter.SelectProductsScreen.temporaryValue.lowRiskCard.expectedTime"),
      monthlyContribution: t("GoalGetter.SelectProductsScreen.temporaryValue.lowRiskCard.monthlyContribution"),
      id: "3",
    },
    {
      type: "medium-risk",
      color: mediumRiskColor,
      title: t("GoalGetter.SelectProductsScreen.temporaryValue.mediumRiskCard.title"),
      header: t("GoalGetter.SelectProductsScreen.temporaryValue.mediumRiskCard.header"),
      basedOn: t("GoalGetter.SelectProductsScreen.temporaryValue.mediumRiskCard.basedOn"),
      expectedTime: t("GoalGetter.SelectProductsScreen.temporaryValue.mediumRiskCard.expectedTime"),
      monthlyContribution: t("GoalGetter.SelectProductsScreen.temporaryValue.mediumRiskCard.monthlyContribution"),
      id: "4",
    },
  ];

  const handleChooseProduct = async () => {
    //TODO : When Api is ready this will work fine
    try {
      const selectedCardId = productsData.find(product => product.type === selectedCard)?.id;
      const response = await getTotalBalance({ targetAmount, targetDate, productId: selectedCardId });
      if (response) {
        setGoalContextState({
          AvailableContribution: response.AvailableContribution,
          RecommendedMonthlyContribution: response.RecommendedMonthlyContribution,
        });
      }
      navigation.navigate("GoalGetter.ContributionScreen");
    } catch (error) {
      warn("product-actions", "Could not freeze product: ", JSON.stringify(error));
    }
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["12p"],
    marginVertical: theme.spacing["12p"],
  }));

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
    marginTop: theme.spacing["12p"],
  }));

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["12p"],
    marginTop: theme.spacing["32p"],
  }));
  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: "clamp",
  });
  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);
  return (
    <Page backgroundColor="neutralBase-60" insets={["bottom"]}>
      <Animated.View style={[styles.animatedHeader, { height: headerScrollHeight }]}>
        <NavHeader
          variant="angled"
          backgroundAngledColor={NavHeaderColor}
          title={
            <View style={styles.progressIndicator}>
              <ProgressIndicator currentStep={4} totalStep={5} />
            </View>
          }
          end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}>
          <HeaderContent goalName="phone" contribution="12,000 SAR" duration="24 months" />
        </NavHeader>
        <View style={titleContainerStyle}>
          <Typography.Text size="title2" weight="medium">
            {t("GoalGetter.SelectProductsScreen.title")}
          </Typography.Text>
        </View>
      </Animated.View>
      <Animated.ScrollView
        style={containerStyle}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={12}>
        {productsData.map((product, index) => (
          <View style={cardContainerStyle} key={index}>
            <MatchProductCard
              item={product}
              isSelected={selectedCard === product.type}
              onSelectCard={() => handleOnSelectCard(product.type)}
            />
          </View>
        ))}
        <Button onPress={handleChooseProduct} disabled={selectedCard === null} loading={isLoading}>
          {t("GoalGetter.SelectProductsScreen.chooseButton")}
        </Button>
      </Animated.ScrollView>
    </Page>
  );
}
const styles = StyleSheet.create({
  animatedHeader: {
    left: 0,
    overflow: "hidden",
    right: 0,
    top: 0,
    width: "100%",
    zIndex: 999,
  },
  progressIndicator: { width: "80%" },
});
