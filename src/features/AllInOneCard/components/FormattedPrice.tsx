import { I18nManager, StyleSheet, View } from "react-native";

import { Typography } from "@/components";

interface PriceComponentProps {
  price: string;
  currency?: string;
}

export default function FormattedPrice({ price, currency }: PriceComponentProps) {
  const formattedPrice = parseFloat(price).toFixed(2);

  const [wholeNumber, decimal] = formattedPrice.split(".");

  return (
    <View style={styles.priceLabel}>
      <View style={styles.priceStyle}>
        <Typography.Text size="callout" weight="bold">
          {wholeNumber}
        </Typography.Text>
        <Typography.Text size="caption1">.{decimal}</Typography.Text>
      </View>
      <Typography.Text size="caption1"> {currency}</Typography.Text>
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
