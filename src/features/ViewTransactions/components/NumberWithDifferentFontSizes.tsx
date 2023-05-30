import React from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, View } from "react-native";

import Typography from "@/components/Typography";

interface NumberWithDifferentFontSizesProps {
  number: string;
}

const NumberWithDifferentFontSizes: React.FC<NumberWithDifferentFontSizesProps> = ({ number }) => {
  const { t } = useTranslation();

  // Split the number into integer and decimal parts
  const [integerPart, decimalPart] = parseFloat(number).toFixed(2).split(".");

  // Add comma as a separator for the integer part
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <View style={styles.spliterStyle}>
      <Typography.Text color="neutralBase-50" size="title2" weight="bold">
        {formattedIntegerPart}
      </Typography.Text>
      <Typography.Text color="neutralBase-50" size="body" weight="bold">
        .{decimalPart ? decimalPart : "00"}
      </Typography.Text>
      <Typography.Text style={styles.currency} color="primaryBase-40" size="body" weight="regular">
        {t("ViewTransactions.TransactionsScreen.sar")}
      </Typography.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  currency: {
    paddingStart: 2,
  },
  spliterStyle: {
    alignItems: "baseline",
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
  },
});

export default NumberWithDifferentFontSizes;
