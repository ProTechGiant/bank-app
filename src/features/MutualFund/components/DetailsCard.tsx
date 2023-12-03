import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, TextStyle, View, ViewStyle } from "react-native";

import { Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { LineCardSection } from "../assets/icons";

interface DetailsCardProps {
  id: string;
  riskType: string;
  title: string;
  currentValue: number;
  expectedReturn: number;
  units: number;
  onPress: (id: string) => void;
}

export default function DetailsCard({
  id,
  riskType,
  title,
  currentValue,
  expectedReturn,
  units,
  onPress,
}: DetailsCardProps) {
  const { t } = useTranslation();

  const handleOnPress = () => {
    onPress(`${id}`);
  };

  // TODO: when api is ready
  const getRiskLevelColor = (riskType: string) => {
    switch (riskType.toLowerCase()) {
      case "high":
        return "#FFD8D4";
      case "medium":
        return "#FBF0B1";
      case "low":
        return "#B2D6FF";
      default:
        return "grey";
    }
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    borderWidth: 1,
    marginBottom: theme.spacing["12p"],
    padding: theme.spacing["12p"],
  }));

  const riskLevelStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    paddingVertical: theme.spacing["4p"],
    backgroundColor: getRiskLevelColor(riskType),
    maxWidth: 70,
    borderRadius: theme.radii.small,
  }));

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  const detailsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    flexDirection: "row",
  }));

  const LineSectionContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["8p"],
  }));

  const contentContainerStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));
  const textStylePaddingVertical = useThemeStyles<TextStyle>(theme => ({
    paddingVertical: theme.spacing["4p"],
  }));

  return (
    <Pressable onPress={handleOnPress} testID="MutualFund.DetailsCard-:Pressable">
      <View style={containerStyle}>
        <View style={riskLevelStyle}>
          <Typography.Text color="neutralBase" weight="regular" size="caption1">
            {riskType}
          </Typography.Text>
        </View>
        <View style={titleContainerStyle}>
          <Typography.Text size="callout" weight="medium">
            {title}
          </Typography.Text>
        </View>

        <View style={detailsContainerStyle}>
          <View style={contentContainerStyle}>
            <Typography.Text color="neutralBase" weight="regular">
              {t("MutualFund.DetailsCard.currentValue")}
            </Typography.Text>

            <Typography.Text weight="semiBold" size="callout" style={textStylePaddingVertical}>
              {currentValue}
              {t("MutualFund.MutualFundDashboardScreen.currency")}
            </Typography.Text>
          </View>
          <View style={LineSectionContainerStyle}>
            <LineCardSection />
          </View>
          <View style={contentContainerStyle}>
            <Typography.Text color="neutralBase" weight="regular">
              {t("MutualFund.DetailsCard.expectedReturn")}
            </Typography.Text>

            <Typography.Text size="callout" weight="medium" style={textStylePaddingVertical}>
              {t("MutualFund.DetailsCard.expectedReturnValue", { value: expectedReturn })}
            </Typography.Text>
          </View>
          <View style={LineSectionContainerStyle}>
            <LineCardSection />
          </View>
          <View style={contentContainerStyle}>
            <Typography.Text color="neutralBase" weight="regular">
              {t("MutualFund.DetailsCard.units")}
            </Typography.Text>

            <Typography.Text size="callout" weight="medium" style={textStylePaddingVertical}>
              {units}
            </Typography.Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
