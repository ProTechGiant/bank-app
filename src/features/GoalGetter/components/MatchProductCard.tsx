import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, TextStyle, View, ViewStyle } from "react-native";

import Divider from "@/components/Divider";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import DonutChart from "./DonutChart";

interface ProductProps {
  color: string;
  title: string;
  header: string;
  basedOn: string;
  expectedTime: string;
  Investments?: string;
  monthlyContribution: string;
  type: string;
}

interface ProductMatchCardProps {
  item: ProductProps;
  isSelected: boolean;
  onSelectCard: () => void;
}

export default function ProductMatchCard({ item, isSelected, onSelectCard }: ProductMatchCardProps) {
  const { t } = useTranslation();
  const [isPortfolioModalVisible, setIsPortfolioModalVisible] = useState(false);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    borderWidth: 1,
    borderColor: item.color,
    paddingHorizontal: theme.spacing["12p"],
  }));

  const riskTextContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    right: theme.spacing["12p"],
    top: -theme.spacing["12p"],
    borderRadius: theme.radii.xlarge,
    overflow: "hidden",
  }));

  const riskTextStyle = useThemeStyles<TextStyle>(theme => ({
    backgroundColor: item.color,
    paddingVertical: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const headerTextStyle = useThemeStyles<TextStyle>(theme => ({
    paddingHorizontal: theme.spacing["8p"],
    paddingVertical: theme.spacing["12p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: theme.spacing["8p"],
  }));

  const investmentContainerStyle = useThemeStyles<TextStyle>(theme => ({
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: theme.spacing["12p"],
    flexDirection: "row",
    paddingHorizontal: theme.spacing["12p"],
    flexWrap: "wrap",
    minHeight: theme.spacing["24p"],
  }));

  const findOutContainerStyle = useThemeStyles<TextStyle>(theme => ({
    alignSelf: "flex-end",
    marginVertical: theme.spacing["20p"],
    flexDirection: "row",
    paddingHorizontal: theme.spacing["12p"],
    flexWrap: "wrap",
  }));

  const descriptionTextStyle = useThemeStyles<TextStyle>(theme => ({
    paddingHorizontal: theme.spacing["8p"],
    paddingBottom: theme.spacing["8p"],
  }));

  const contentWidth = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["12p"],
    width: "40%",
  }));

  const selectedCardStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: `${item.color}1A`,
    paddingHorizontal: theme.spacing["12p"],
  }));

  const textItalicStyle = useThemeStyles<TextStyle>(() => ({
    fontStyle: "italic",
  }));

  return (
    <Pressable
      style={[containerStyle, isSelected && selectedCardStyle]}
      onPress={() => {
        onSelectCard();
      }}>
      <View style={riskTextContainerStyle}>
        <Typography.Text style={riskTextStyle} color="neutralBase-60" size="caption2" weight="bold">
          {item.title}
        </Typography.Text>
      </View>
      <Typography.Text size="body" weight="bold" style={headerTextStyle}>
        {item.header}
      </Typography.Text>
      <Divider
        color={
          item.type === "high-risk"
            ? "complimentBase"
            : item.type === "low-risk"
            ? "primaryBase-40"
            : item.type === "medium-risk"
            ? "warningBase"
            : "successBase-10"
        }
      />
      <View>
        <View style={contentContainerStyle}>
          <View style={contentWidth}>
            <Typography.Text size="footnote" weight="regular">
              {t("GoalGetter.SelectProductsScreen.productMatchCard.expectedTime")}
            </Typography.Text>
          </View>
          <View style={contentWidth}>
            <Typography.Text size="footnote" weight="regular">
              {t("GoalGetter.SelectProductsScreen.productMatchCard.monthlyContribution")}
            </Typography.Text>
          </View>
        </View>
        <View style={contentContainerStyle}>
          <View style={contentWidth}>
            <Typography.Text size="body" weight="bold">
              {item.expectedTime}
            </Typography.Text>
          </View>
          <View style={contentWidth}>
            <Typography.Text size="body" weight="bold">
              {item.monthlyContribution}
            </Typography.Text>
          </View>
        </View>
        <Typography.Text size="footnote" weight="regular" color="neutralBase-10" style={descriptionTextStyle}>
          {item.basedOn}
        </Typography.Text>
      </View>
      <Divider
        color={
          item.type === "high-risk"
            ? "complimentBase"
            : item.type === "low-risk"
            ? "primaryBase-40"
            : item.type === "medium-risk"
            ? "warningBase"
            : "successBase-10"
        }
      />
      <View
        style={
          item.type === "high-risk" || item.type === "medium-risk" ? findOutContainerStyle : investmentContainerStyle
        }>
        {item.type === "high-risk" || item.type === "medium-risk" ? (
          <Typography.Text
            color="interactionBase"
            size="caption1"
            weight="medium"
            style={[textItalicStyle, { textDecorationLine: "underline" }]}
            onPress={() => setIsPortfolioModalVisible(true)}>
            {t("GoalGetter.SelectProductsScreen.productMatchCard.findOutMore")}
          </Typography.Text>
        ) : item.Investments ? (
          <Typography.Text size="caption1" weight="regular" color="neutralBase-10" style={textItalicStyle}>
            {item.Investments}
          </Typography.Text>
        ) : null}
      </View>

      <DonutChart isVisible={isPortfolioModalVisible} onClose={() => setIsPortfolioModalVisible(false)} />
    </Pressable>
  );
}
