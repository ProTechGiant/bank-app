import { format } from "date-fns";
import { t } from "i18next";
import React from "react";
import { I18nManager, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";

import { ChevronRightIcon } from "../../../assets/icons";
import { Theme, useThemeStyles } from "../../../theme";
import { ShoppingCartIcon } from "../assets/icons";

interface TransectionDetailsProps {
  statementReference: string;
  bookingDateTime: number[];
  amount: string;
  color: keyof Theme["palette"];
}

export default function TransectionDetails({
  statementReference,
  bookingDateTime,
  amount,
  color,
}: TransectionDetailsProps) {
  const { chevronColor, giftColor } = useThemeStyles(theme => ({
    chevronColor: theme.palette["neutralBase-20"],
    giftColor: theme.palette[color],
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
    flexDirection: "row",
    gap: theme.spacing["12p"],
    alignItems: "center",
    justifyContent: "space-between",
  }));

  return (
    <View style={containerStyle}>
      <ShoppingCartIcon color={giftColor} />
      <View style={styles.expandText}>
        <Typography.Text size="callout" color="neutralBase+30">
          {statementReference}
        </Typography.Text>
        <Typography.Text size="footnote" color="neutralBase">
          {format(new Date(bookingDateTime[0], bookingDateTime[1] - 1, bookingDateTime[2]), "dd MMMM yyyy")}
        </Typography.Text>
      </View>
      <Typography.Text size="callout">
        {amount} {t("Currency.sar")}
      </Typography.Text>
      <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
        <ChevronRightIcon color={chevronColor} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  expandText: {
    flex: 1,
  },
});
