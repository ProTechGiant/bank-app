import { t } from "i18next";
import React, { Fragment, useEffect, useState } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { ApiNonGroupedTransactionsResponseElement } from "@/hooks/use-transactions";
import { Theme, useThemeStyles } from "@/theme";

import TransectionDetails from "./TransactionDetails";

interface TransactionItemProps {
  transaction?: ApiNonGroupedTransactionsResponseElement[];
  color: keyof Theme["palette"];
  label: string;
  handleTransactionPress: (transactionItem: ApiNonGroupedTransactionsResponseElement) => void;
}

const TransactionItem = ({ transaction, color, label, handleTransactionPress }: TransactionItemProps) => {
  const [seeAll, setSeeAll] = useState<boolean>(false);

  useEffect(() => {
    setSeeAll(false);
  }, [transaction]);

  const TransectionDetailsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));
  const emptyTransactionTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["20p"],
  }));

  return (
    <Fragment>
      <View style={styles.titleContainer}>
        <Typography.Text size="title3" weight="medium" color="neutralBase+30">
          {t("TopSpending.SpendSummaryScreen.transactions")} - {label}
        </Typography.Text>
        {!seeAll && transaction && transaction?.length > 3 ? (
          <Pressable onPress={() => setSeeAll(true)}>
            <Typography.Text size="footnote" color="interactionBase">
              {t("TopSpending.SpendSummaryScreen.seeAll")}
            </Typography.Text>
          </Pressable>
        ) : null}
      </View>
      {transaction ? (
        <Fragment>
          {transaction.slice(0, seeAll ? undefined : 3).map(item => (
            <Pressable
              key={item.TransactionId}
              onPress={() => handleTransactionPress(item)}
              style={TransectionDetailsContainerStyle}>
              <TransectionDetails
                color={color}
                amount={item.Amount.Amount}
                bookingDateTime={item.BookingDateTime}
                statementReference={item.StatementReference}
              />
            </Pressable>
          ))}
        </Fragment>
      ) : (
        <Typography.Text align="center" style={emptyTransactionTextStyle} size="footnote" color="neutralBase">
          {t("TopSpending.SpendSummaryScreen.emptyTransactions")}
        </Typography.Text>
      )}
    </Fragment>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
