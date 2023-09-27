import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { HeaderContent, MatchProductCard } from "../components";

export default function MatchProductsScreen() {
  const { t } = useTranslation();

  const [selectedCard, setSelectedCard] = useState<string | null>(null);

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
    },
    {
      type: "low-risk",
      color: lowRiskColor,
      title: t("GoalGetter.SelectProductsScreen.temporaryValue.lowRiskCard.title"),
      header: t("GoalGetter.SelectProductsScreen.temporaryValue.lowRiskCard.header"),
      basedOn: t("GoalGetter.SelectProductsScreen.temporaryValue.lowRiskCard.basedOn"),
      expectedTime: t("GoalGetter.SelectProductsScreen.temporaryValue.lowRiskCard.expectedTime"),
      monthlyContribution: t("GoalGetter.SelectProductsScreen.temporaryValue.lowRiskCard.monthlyContribution"),
    },
    {
      type: "medium-risk",
      color: mediumRiskColor,
      title: t("GoalGetter.SelectProductsScreen.temporaryValue.mediumRiskCard.title"),
      header: t("GoalGetter.SelectProductsScreen.temporaryValue.mediumRiskCard.header"),
      basedOn: t("GoalGetter.SelectProductsScreen.temporaryValue.mediumRiskCard.basedOn"),
      expectedTime: t("GoalGetter.SelectProductsScreen.temporaryValue.mediumRiskCard.expectedTime"),
      monthlyContribution: t("GoalGetter.SelectProductsScreen.temporaryValue.mediumRiskCard.monthlyContribution"),
    },
  ];

  const handleChooseProduct = () => {
    //TODO: when api is ready
    console.log("Selected Product:", selectedCard);
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

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader variant="angled" withBackButton={false}>
        {/* TODO:data will be dynamic when api is ready */}
        <ProgressIndicator currentStep={3} totalStep={5} />
        <HeaderContent goalName="phone" contribution="12,000 SAR" duration="24 months" />
      </NavHeader>
      <View style={titleContainerStyle}>
        <Typography.Text size="title2" weight="medium">
          {t("GoalGetter.SelectProductsScreen.title")}
        </Typography.Text>
      </View>

      <ScrollView style={containerStyle}>
        {productsData.map((product, index) => (
          <View style={cardContainerStyle} key={index}>
            <MatchProductCard
              item={product}
              isSelected={selectedCard === product.type}
              onSelectCard={() => handleOnSelectCard(product.type)}
            />
          </View>
        ))}
        <Button onPress={handleChooseProduct} disabled={selectedCard === null}>
          {t("GoalGetter.SelectProductsScreen.chooseButton")}
        </Button>
      </ScrollView>
    </Page>
  );
}
