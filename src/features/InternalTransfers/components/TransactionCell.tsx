import { format } from "date-fns";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

import { BuyTransferIcon, ErrorCircleIcon, LocalTransferIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { Transaction } from "../types";

interface TransactionCellPros {
  transaction: Transaction; //TODO: replace with transaction type when finalised
  onPress: () => void;
}

export default function TransactionCell({ transaction, onPress }: TransactionCellPros) {
  const itemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const { debitTransactionIconColor, creditTransactionIconColor, failTransactionIconColor } = useThemeStyles(theme => ({
    debitTransactionIconColor: theme.palette["successBase-10"],
    creditTransactionIconColor: theme.palette["errorBase-10"],
    failTransactionIconColor: theme.palette.neutralBase,
  }));

  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" gap="12p" align="center" justify="space-between" style={itemStyle}>
        {transaction.Status === "fail" ? (
          <ErrorCircleIcon color={failTransactionIconColor} />
        ) : transaction.CreditDebitIndicator === "debit" ? (
          <BuyTransferIcon color={debitTransactionIconColor} />
        ) : (
          <LocalTransferIcon color={creditTransactionIconColor} />
        )}
        <Stack direction="vertical" style={styles.expandText}>
          <Typography.Text size="callout" weight="medium" color="neutralBase+30">
            {transaction?.beneficiaryName}
          </Typography.Text>
          <Typography.Text size="footnote" weight="regular" color="neutralBase">
            {transaction?.AccountNumberMasked}
          </Typography.Text>
        </Stack>
        <Stack direction="vertical" align="flex-end">
          <Typography.Text
            size="callout"
            weight="medium"
            color={transaction.Status === "fail" ? "neutralBase-20" : "neutralBase+30"}>
            {formatCurrency(Number(transaction.Amount.Amount), transaction.Amount.Currency)}
          </Typography.Text>
          <Typography.Text size="footnote" weight="regular" color="neutralBase">
            {format(
              new Date(
                transaction.BookingDateTime[0],
                transaction.BookingDateTime[1] - 1,
                transaction.BookingDateTime[2]
              ),
              "dd MMM yyyy"
            )}
          </Typography.Text>
        </Stack>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  expandText: {
    flex: 1,
  },
});
