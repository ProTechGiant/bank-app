import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { Typography } from "@/components";
import Divider from "@/components/Divider";
import { useThemeStyles } from "@/theme";

import { ArrowDown, ArrowUp, CircleIcon } from "../assets/icons";

interface DetailsCardProps {
  id: number;
  title: string;
  investedValue: number;
  isDown: boolean;
  navValue: number;
  ytdValue: number;
  averageCostValue: number;
  unitsValue: number;
  onPress: (value: string) => void;
}

export default function DetailsCard({
  id,
  title,
  investedValue,
  isDown,
  ytdValue,
  navValue,
  unitsValue,
  averageCostValue,
  onPress,
}: DetailsCardProps) {
  const { t } = useTranslation();

  const handleOnPress = () => {
    onPress(`${id}`);
  };
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    borderWidth: 1,
    marginBottom: theme.spacing["12p"],
  }));

  const circleIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["8p"],
    paddingVertical: theme.spacing["16p"],
  }));

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  const detailsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-30"],
  }));

  const arrowIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
    paddingHorizontal: theme.spacing["4p"],
  }));

  const valueTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
    paddingVertical: theme.spacing["4p"],
    lineHeight: theme.typography.text._lineHeights.callout,
  }));

  const contentContainerStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["8p"],
    flexDirection: "row",
    justifyContent: "space-between",
  }));

  return (
    <Pressable onPress={handleOnPress}>
      <View style={containerStyle}>
        <View style={styles.flexDirectionRow}>
          <View style={circleIconContainerStyle}>
            <CircleIcon />
          </View>
          <View style={titleContainerStyle}>
            <Typography.Text size="callout" weight="medium">
              {title}
            </Typography.Text>
            <Typography.Text color="neutralBase" weight="regular">
              {t("MutualFund.PortfolioDetailsScreen.DetailsCard.investedValue", { value: investedValue })}
            </Typography.Text>
          </View>
        </View>
        <Divider color="neutralBase-30" />

        <View style={detailsContainerStyle}>
          <View style={contentContainerStyle}>
            <Typography.Text color="neutralBase" weight="regular">
              {t("MutualFund.PortfolioDetailsScreen.DetailsCard.NAV")}
            </Typography.Text>
            <Typography.Text color="neutralBase" weight="regular">
              {t("MutualFund.PortfolioDetailsScreen.DetailsCard.YTD")}
            </Typography.Text>
          </View>
          <View style={styles.flexDirectionRowSpaceBetween}>
            <Typography.Text weight="semiBold" size="callout">
              {navValue}
            </Typography.Text>

            {isDown ? (
              <View style={styles.flexDirectionRow}>
                <Typography.Text color="complimentBase" size="callout" weight="medium">
                  {ytdValue}
                </Typography.Text>
                <View style={arrowIconContainerStyle}>
                  <ArrowDown />
                </View>
              </View>
            ) : (
              <View style={styles.flexDirectionRow}>
                <Typography.Text color="successBase" size="callout" weight="medium">
                  {ytdValue}
                </Typography.Text>
                <View style={arrowIconContainerStyle}>
                  <ArrowUp />
                </View>
              </View>
            )}
          </View>
          <View style={contentContainerStyle}>
            <Typography.Text color="neutralBase" weight="regular">
              {t("MutualFund.PortfolioDetailsScreen.DetailsCard.Units")}
            </Typography.Text>
            <Typography.Text color="neutralBase" weight="regular">
              {t("MutualFund.PortfolioDetailsScreen.DetailsCard.AverageCost")}
            </Typography.Text>
          </View>
          <View style={styles.flexDirectionRowSpaceBetween}>
            <Typography.Text weight="semiBold" size="callout" style={valueTextStyle}>
              {unitsValue}
            </Typography.Text>
            <Typography.Text weight="semiBold" size="callout" style={valueTextStyle}>
              {averageCostValue}
            </Typography.Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flexDirectionRow: {
    flexDirection: "row",
  },
  flexDirectionRowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
