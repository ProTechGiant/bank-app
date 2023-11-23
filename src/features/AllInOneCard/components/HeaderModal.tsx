import { useTranslation } from "react-i18next";
import { Dimensions, Image, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

import BackgroundBottom from "@/assets/BackgroundBottom";
import { CloseIcon } from "@/assets/icons";
import { Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import HalfNeraCard from "../assets/images/halfNeraCard.png";
import HalfNeraPlusCard from "../assets/images/halfNeraPlusCard.png";
import { CardData, CardTypes } from "../types";
import FormattedPrice from "./FormattedPrice";

interface HeaderModalProps {
  onClose: () => void;
  item: CardData;
}

export default function HeaderModal({ onClose, item }: HeaderModalProps) {
  const { t } = useTranslation();
  const isNeraPlus = item.cardType === CardTypes.NERA_PLUS;
  const screenWidth = Dimensions.get("window").width;

  const backgroundBottomStyleDefault = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: -theme.spacing["24p"] + 1, // Small gap forms on iphone SE, 1 pixel added to remove this.
  }));
  const closeIconStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60-60%"],
    width: theme.spacing["32p"],
    height: theme.spacing["32p"],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.spacing["16p"],
    position: "absolute",
    top: theme.spacing["20p"],
    right: theme.spacing["20p"],
  }));

  const imageContainerStyle = useThemeStyles<ViewStyle>(() => ({
    position: "absolute",
    top: isNeraPlus ? 75 : 92,
    left: screenWidth / 2 - 234.622 / 2,
  }));

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    padding: theme.spacing["20p"],
  }));

  const descriptionContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
  }));
  const subscriptionViewStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing["4p"],
    borderRadius: 5,
  }));

  const subscriptionsViewStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing["12p"],
  }));

  return (
    <View style={styles.container}>
      <View style={[backgroundBottomStyleDefault]}>
        <BackgroundBottom color="#2E2A34" />
      </View>
      <View style={imageContainerStyle}>
        <Image source={isNeraPlus ? HalfNeraPlusCard : HalfNeraCard} />
      </View>
      <View style={titleContainerStyle}>
        <Typography.Text weight="medium" size="callout" color="neutralBase-60" align="center">
          {isNeraPlus ? "nera Plus" : "nera"}
        </Typography.Text>
      </View>
      <Pressable style={closeIconStyle} onPress={onClose} testID="AllInOneCard.SelectCardScreen:Pressable">
        <CloseIcon />
      </Pressable>
      <View style={descriptionContainerStyle}>
        <View style={styles.titleWithRecommendedContainer}>
          <Typography.Text weight="bold" size="title1" color="neutralBase-60">
            {isNeraPlus ? "nera Plus" : "nera"}
          </Typography.Text>
          {isNeraPlus ? (
            <View style={styles.recommendedContainer}>
              <Text style={styles.textRecommended}>{t("AllInOneCard.SelectedCardScreen.recommended")}</Text>
            </View>
          ) : null}
        </View>
        <View style={subscriptionsViewStyle}>
          {!isNeraPlus ? (
            <View style={subscriptionViewStyle}>
              <Typography.Text size="caption1" weight="bold" align="center" color="neutralBase-40">
                {t("AllInOneCard.SelectedCardScreen.free")}
              </Typography.Text>
            </View>
          ) : (
            <>
              <View style={subscriptionViewStyle}>
                <FormattedPrice
                  price="438"
                  currency={t("AllInOneCard.SelectedCardScreen.SARYearly")}
                  color="neutralBase-40"
                />
              </View>
              <View style={subscriptionViewStyle}>
                <FormattedPrice
                  price="50"
                  currency={t("AllInOneCard.SelectedCardScreen.SARMonthly")}
                  color="neutralBase-40"
                />
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2E2A34",
    height: 200,
  },
  recommendedContainer: {
    backgroundColor: "#3AFDDC",
    borderRadius: 2.3,
    height: 17.5,
    paddingHorizontal: 6.364,
    paddingVertical: 3.182,
    zIndex: 1,
  },
  textRecommended: {
    color: "#2E2E2E",
    fontSize: 8,
    fontWeight: "500",
    lineHeight: 12.5,
  },
  titleWithRecommendedContainer: { alignItems: "center", flexDirection: "row", gap: 4 },
});
