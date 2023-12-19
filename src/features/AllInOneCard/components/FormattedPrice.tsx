import { I18nManager, StyleSheet, View } from "react-native";

import { Typography } from "@/components";
import { Theme } from "@/theme";

interface PriceComponentProps {
  price: string;
  currency?: string;
  color?: keyof Theme["palette"];
  currencyColor?: keyof Theme["palette"];
}

export default function FormattedPrice({ price, currency, color, currencyColor }: PriceComponentProps) {
  const formattedPrice = parseFloat(price).toFixed(2);

  const [wholeNumber, decimal] = formattedPrice.split(".");

  return (
    <View style={styles.priceLabel}>
      <View style={styles.priceStyle}>
        <Typography.Text size="callout" weight="bold" color={color}>
          {wholeNumber}
        </Typography.Text>
        <Typography.Text size="caption1" color={color}>
          .{decimal}
        </Typography.Text>
      </View>
      <Typography.Text size="caption1" color={currencyColor}>
        {" "}
        {currency}
      </Typography.Text>
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
