import { I18nManager, Pressable, StyleSheet, ViewStyle } from "react-native";

import { ChevronRightIcon, GiftIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { Transaction } from "../types";

interface TransactionCellPros {
  transaction: Transaction;
}

export default function TransactionCell({ transaction }: TransactionCellPros) {
  const itemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const { chevronColor, giftColor } = useThemeStyles(theme => ({
    chevronColor: theme.palette["neutralBase-20"],
    giftColor: theme.palette["primaryBase-40"],
  }));
  return (
    <Stack direction="horizontal" gap="12p" align="center" justify="space-between" style={itemStyle}>
      <GiftIcon color={giftColor} />
      <Stack direction="vertical" style={styles.expandText}>
        <Typography.Text size="callout" weight="medium" color="neutralBase+30">
          {transaction.MerchantDetails.MerchantName}
        </Typography.Text>
        <Typography.Text size="footnote" weight="regular" color="neutralBase">
          {transaction.BookingDateTime}
        </Typography.Text>
      </Stack>
      <Typography.Text size="callout" color="neutralBase+30">
        {formatCurrency(transaction.Amount.Amount, transaction.Amount.Currency)}
      </Typography.Text>
      <Pressable style={styles.pressable}>
        <ChevronRightIcon color={chevronColor} />
      </Pressable>
    </Stack>
  );
}

const styles = StyleSheet.create({
  expandText: {
    flex: 1,
  },
  pressable: {
    transform: [
      {
        scaleX: I18nManager.isRTL ? -1 : 1,
      },
    ],
  },
});
