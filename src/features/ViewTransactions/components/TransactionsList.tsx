import { format, isToday, isYesterday } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { Transaction, TransactionDetailed } from "../types";
import FormatTransactionAmount from "./FormatTransactionAmount";

interface TransactionGroup {
  Key: string;
  Value: string;
  Transactions: Transaction[];
}

interface TransactionsListProps {
  transactionsAll: {
    data: {
      GroupedTransactions: TransactionGroup[];
    };
  };
  cardId: string;
  createDisputeUserId: string;
}

export default function TransactionsList({ transactionsAll, cardId, createDisputeUserId }: TransactionsListProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleNavigation = (transaction: Transaction) => {
    const obj: TransactionDetailed = {
      cardType: transaction.CardType,
      status: transaction.Status,
      location: transaction.AddressLine ? transaction.AddressLine : false,
      title: transaction.MerchantDetails.MerchantName,
      subTitle: transaction.TransactionInformation,
      amount: transaction.Amount.Amount,
      currency: transaction.Amount.Currency,
      transactionDate: transaction.BookingDateTime,
      roundUpsAmount: transaction.SupplementaryData.RoundupAmount,
      categoryName: transaction.SupplementaryData.CategoryName,
      categoryId: transaction.SupplementaryData.CategoryId,
    };

    navigation.navigate("ViewTransactions.SingleTransactionDetailedScreen", { data: obj, cardId, createDisputeUserId });
  };

  const formatDate = (date: Date): string => {
    if (isToday(date)) {
      return t("ViewTransactions.TransactionsScreen.today");
    } else if (isYesterday(date)) {
      return t("ViewTransactions.TransactionsScreen.yesterday");
    } else {
      return format(new Date(date), "EEEE d MMM");
    }
  };

  const firstRow = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: theme.spacing["8p"],
  }));

  const line = useThemeStyles<ViewStyle>(theme => ({
    height: 0.5,
    backgroundColor: theme.palette.neutralBase,
  }));

  const transactionRow = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <>
      {transactionsAll.data?.GroupedTransactions.map((transactionGroup: TransactionGroup, index: number) => {
        let sum = 0;
        transactionGroup.Transactions.forEach((transaction: Transaction) => {
          if (transaction.CreditDebitIndicator === "Debit") {
            sum -= parseFloat(transaction.Amount.Amount);
          } else {
            sum += parseFloat(transaction.Amount.Amount);
          }
        });
        return (
          <View key={`${transactionGroup.Value}-${index}`}>
            <View style={firstRow}>
              <Typography.Text color="neutralBase" size="callout" weight="semiBold">
                {formatDate(new Date(transactionGroup.Value))}
              </Typography.Text>
              <Typography.Text color="neutralBase" size="callout" weight="semiBold">
                {FormatTransactionAmount(sum, true, "neutralBase")}
              </Typography.Text>
            </View>
            <View style={line} />
            <View style={styles.roundUpContainer}>
              {transactionGroup.Transactions.map((transaction: Transaction) => (
                <Pressable key={transaction.TransactionId} onPress={() => handleNavigation(transaction)}>
                  <View style={transactionRow}>
                    {transaction.CreditDebitIndicator === "Debit" ? (
                      <>
                        <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                          {transaction.StatementReference}
                        </Typography.Text>
                        <View style={styles.roundAlign}>
                          <Typography.Text color="neutralBase+30" size="callout" weight="semiBold">
                            {FormatTransactionAmount(parseFloat(transaction.Amount.Amount), false, "neutralBase+30")}
                          </Typography.Text>
                          <Typography.Text color="neutralBase-10" size="caption2" weight="regular">
                            {t("ViewTransactions.TransactionsScreen.roundUp")}
                          </Typography.Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <Typography.Text color="neutralBase+10" size="callout" weight="medium">
                          {transaction.StatementReference}
                        </Typography.Text>
                        <Typography.Text color="successBase" size="callout" weight="semiBold">
                          {FormatTransactionAmount(parseFloat(transaction.Amount.Amount), true, "successBase")}
                        </Typography.Text>
                      </>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  roundAlign: {
    alignItems: "flex-end",
    flexDirection: "column",
    flex: 1,
  },
  roundUpContainer: {
    flexDirection: "column",
  },
});
