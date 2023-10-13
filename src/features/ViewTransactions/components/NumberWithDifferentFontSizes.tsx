import React from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, View } from "react-native";

import Typography from "@/components/Typography";
import { formatCurrency } from "@/utils";

interface NumberWithDifferentFontSizesProps {
  number: string;
  testID?: string;
}

const NumberWithDifferentFontSizes: React.FC<NumberWithDifferentFontSizesProps> = ({ number, testID }) => {
  const { t } = useTranslation();

  // Split the number into integer and decimal parts
  const [integerPart, decimalPart] = parseFloat(number).toFixed(2).split(".");
  const formattedIntegerPart = formatCurrency(Number.parseInt(integerPart, 10));

  return (
    <View style={styles.spliterStyle} testID={testID}>
      <Typography.Text color="neutralBase-50" size="title2" weight="bold">
        {formattedIntegerPart}
      </Typography.Text>
      <Typography.Text color="neutralBase-50" size="body" weight="bold">
        .{decimalPart ? decimalPart : "00"}
      </Typography.Text>
      <Typography.Text style={styles.currency} color="primaryBase-40" size="body" weight="regular">
        {" "}
        {t("Currency.sar")}
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
