import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, View } from "react-native";

import { Typography } from "@/components";

interface PriceComponentProps {
  price: string;
}

export default function FormattedPrice({ price }: PriceComponentProps) {
  const { t } = useTranslation();

  const [wholeNumber, decimal] = price.split(".");

  return (
    <View style={styles.priceLabel}>
      <View style={styles.priceStyle}>
        <Typography.Text size="callout" weight="bold">
          {wholeNumber}
        </Typography.Text>
        <Typography.Text size="caption1">.{decimal}</Typography.Text>
      </View>
      <Typography.Text size="caption1"> {t("AllInOneCard.CardReviewScreen.SAR")}</Typography.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  priceLabel: {
    alignItems: "baseline",
    flexDirection: "row",
  },
  priceStyle: {
    alignItems: "baseline",
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
  },
});
