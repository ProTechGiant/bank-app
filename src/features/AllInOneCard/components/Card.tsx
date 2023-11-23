import React from "react";
import { useTranslation } from "react-i18next";
import { Image, ImageStyle, StyleSheet, View, ViewStyle } from "react-native";

import { DiamondIcon } from "@/assets/icons";
import { Typography } from "@/components";
import Divider from "@/components/Divider";
import SvgIcon from "@/components/SvgIcon/SvgIcon";
import { useThemeStyles } from "@/theme";

import { NeraPlusCard } from "../assets/icons";
import NeraCard from "../assets/images/neraCard.png";
import { neraCardBenefits, neraPlusCardBenefits } from "../mocks";
import { CardData, CardTypes } from "../types";
import FormattedPrice from "./FormattedPrice";

interface CardProps {
  data: CardData;
}

export default function Card({ data }: CardProps) {
  const { t } = useTranslation();

  const isNeraPlus = data.cardType === CardTypes.NERA_PLUS;
  const benefits = isNeraPlus ? neraPlusCardBenefits : neraCardBenefits;
  const containerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: "#fff",
    borderRadius: theme.spacing["20p"],
    boxShadow: "0px 4px 10px 0px rgba(45, 55, 61, 0.10)",
    paddingHorizontal: theme.spacing["16p"],
    paddingTop: 40,
    paddingBottom: 35,
    shadowColor: "#000",
  }));

  const titleViewStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing["4p"],
    marginBottom: theme.spacing["12p"],
  }));
  const subscriptionsViewStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing["12p"],
  }));

  const subscriptionViewStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing["4p"],
    paddingHorizontal: theme.spacing["8p"],
    borderRadius: 5,
    backgroundColor: theme.palette["secondary_mintBase-10"],
  }));

  const freeBenefitsViewStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "center",
    gap: -theme.spacing["4p"],
    marginTop: theme.spacing["12p"],
  }));
  const benefitsContainerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["12p"],
  }));
  const imageStyle = useThemeStyles<ImageStyle>(theme => ({
    width: theme.spacing["24p"],
    height: theme.spacing["24p"],
  }));

  return (
    <View style={containerViewStyle}>
      <View style={styles.imageContainer}>
        {isNeraPlus ? (
          <NeraPlusCard />
        ) : (
          <View>
            <Image source={NeraCard} style={styles.imageSize} />
          </View>
        )}
      </View>
      <View style={titleViewStyle}>
        {isNeraPlus ? <DiamondIcon width={17} height={16} color="#000" /> : null}
        <Typography.Header size="small" weight="bold" align="center">
          {isNeraPlus ? "nera Plus" : "nera"}
        </Typography.Header>
      </View>

      <View style={styles.gridContainer}>
        {data.benefits?.slice(0, isNeraPlus ? 6 : 4).map((item, index) => (
          <View style={{ width: isNeraPlus ? "25%" : "35%", alignItems: "center" }} key={index}>
            <View style={styles.gridItem}>
              <View style={styles.iconContainer}>
                <SvgIcon uri={item.iconUrl} width={16} height={16} color="#F6371F" />
              </View>
              <Typography.Text size="caption1" align="center">
                {item.title}
              </Typography.Text>
            </View>
          </View>
        ))}
      </View>
      <Divider color="neutralBase-30" />
      <View style={benefitsContainerViewStyle}>
        <Typography.Text size="callout" weight="bold" align="center" style={styles.content}>
          {t("AllInOneCard.SelectedCardScreen.freeBenefits")}
        </Typography.Text>
        <Typography.Text size="caption1" align="center">
          {isNeraPlus
            ? t("AllInOneCard.SelectedCardScreen.free2subscription")
            : t("AllInOneCard.SelectedCardScreen.free3months")}
        </Typography.Text>
        <View style={freeBenefitsViewStyle}>
          {benefits.map((item, index) => (
            <View style={styles.circleContainer} key={index}>
              <Image source={item} style={imageStyle} />
            </View>
          ))}
        </View>
      </View>
      <View style={subscriptionsViewStyle}>
        {!isNeraPlus ? (
          <View style={subscriptionViewStyle}>
            <Typography.Text size="caption1" weight="bold" align="center" color="neutralBase+30">
              {t("AllInOneCard.SelectedCardScreen.free")}
            </Typography.Text>
          </View>
        ) : (
          <>
            <View style={subscriptionViewStyle}>
              <FormattedPrice price="438" currency={t("AllInOneCard.SelectedCardScreen.SARYearly")} />
            </View>
            <View style={subscriptionViewStyle}>
              <FormattedPrice price="50" currency={t("AllInOneCard.SelectedCardScreen.SARMonthly")} />
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circleContainer: {
    alignItems: "center",
    borderColor: "#D9D9D9",
    borderRadius: 12.5,
    borderWidth: 1,
    height: 25,
    justifyContent: "center",
    overflow: "hidden",
    width: 25,
  },
  content: {
    fontSize: 16,
  },
  gridContainer: {
    alignItems: "flex-start",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    height: 230,
    justifyContent: "center",
    width: "100%",
  },
  gridItem: {
    alignItems: "center",
    gap: 10,
    justifyContent: "flex-end",
    marginVertical: 10,
    width: 85,
  },
  iconContainer: {
    height: 10,
  },
  imageContainer: {
    height: 115,
    left: 73,
    position: "absolute",
    top: -70,
    width: 180,
  },
  imageSize: {
    height: 115,
    width: 180,
  },
});
