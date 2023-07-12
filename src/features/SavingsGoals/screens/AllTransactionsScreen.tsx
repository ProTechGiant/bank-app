import { RouteProp, useRoute } from "@react-navigation/native";
import { format, isToday, isYesterday } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, I18nManager, Pressable, StatusBar, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FormatTransactionAmount from "@/components/FormatTransactionAmount";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";

import { useSavingsPot } from "../hooks/query-hooks";
import { savingsMocksData } from "../mocks/mockTransactionsSavingGoal";
import { SavingsGoalsStackParams } from "../SavingsGoalsStack";
import { GoalTransaction, SavingGoalTransaction } from "../types";

export default function AllTransactionsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const route = useRoute<RouteProp<SavingsGoalsStackParams, "SavingsGoals.AllTransactionsScreen">>();
  const { PotId } = route.params ?? {};

  const { data: savingsPotData } = useSavingsPot(PotId);

  const availableBalance = savingsPotData?.AvailableBalanceAmount ?? 0;
  const formattedBalance = parseFloat(String(availableBalance)).toFixed(2);
  const [integerPart, decimalPart] = formattedBalance.split(".");

  // Add comma as a separator for the integer part
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const formatDate = (date: Date): string => {
    if (isToday(date)) {
      return t("SavingsGoals.GoalDetailsScreen.AllTransactions.today");
    } else if (isYesterday(date)) {
      return t("SavingsGoals.GoalDetailsScreen.AllTransactions.yesterday");
    } else {
      return format(new Date(date), "EEEE d MMM");
    }
  };

  const handleNavigation = (transaction: GoalTransaction) => {
    const obj: SavingGoalTransaction = {
      TransactionName: transaction.StatementReference,
      TransactionDate: transaction.BookingDateTime,
      TransactionAmount: transaction.Amount.Amount,
      TransactionStatus: transaction.Status,
      Category: transaction.Category,
    };
    navigation.navigate("SavingsGoals.TransactionDetailScreen", { data: obj, PotId });
  };

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const contentStyle = useThemeStyles(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingBottom: theme.spacing["32p"],
    marginTop: theme.spacing["16p"],
    flex: 1,
  }));

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.primaryBase,
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["8p"],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }));

  const balanceStyle = useThemeStyles<TextStyle>(theme => ({
    textAlign: "left",
    marginVertical: theme.spacing["4p"],
  }));

  const firstRowStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: theme.spacing["8p"],
  }));

  const lineStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 0.5,
    backgroundColor: theme.palette.neutralBase,
  }));

  const transactionRowStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing["12p"],
  }));

  return (
    <Page insets={["left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor={palette.primaryBase} translucent />
      <SafeAreaView edges={["top"]} style={styles.header}>
        <NavHeader onBackPress={handleOnBackPress} title={savingsPotData?.GoalName} />
        <View style={headerStyle}>
          <View>
            <Typography.Text style={balanceStyle} size="footnote" weight="regular" color="primaryBase-40">
              {t("SavingsGoals.GoalDetailsScreen.AllTransactions.balance")}
            </Typography.Text>
            <View style={styles.spliterStyle}>
              <Typography.Text color="neutralBase-50" size="large">
                {formattedIntegerPart}
              </Typography.Text>
              <Typography.Text color="neutralBase-50" size="title2" weight="bold">
                .{decimalPart ? decimalPart : "00"}
              </Typography.Text>
              <Typography.Text style={styles.currency} color="primaryBase-40" size="title2">
                {t("ViewTransactions.TransactionsScreen.sar")}
              </Typography.Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <View style={contentStyle}>
        <FlatList
          data={savingsMocksData.data?.GroupedTransactions}
          renderItem={({ item }) => {
            const sum = item.Transactions.reduce(
              (total, item) =>
                item.CreditDebitIndicator === "Debit"
                  ? total - parseFloat(item.Amount.Amount)
                  : total + parseFloat(item.Amount.Amount),
              0
            );
            return (
              <View>
                <View style={firstRowStyle}>
                  <Typography.Text color="neutralBase" size="callout" weight="semiBold">
                    {formatDate(new Date(item.Value))}
                  </Typography.Text>
                  <Typography.Text color="neutralBase" size="callout" weight="semiBold">
                    <FormatTransactionAmount
                      amount={sum}
                      isPlusSignIncluded={true}
                      integerSize="callout"
                      decimalSize="footnote"
                      isCurrencyIncluded={false}
                      color="neutralBase"
                    />
                  </Typography.Text>
                </View>
                <View style={lineStyle} />
                <View style={styles.roundUpContainer}>
                  {item.Transactions.map(transaction => (
                    <Pressable onPress={() => handleNavigation(transaction)} key={transaction.TransactionId}>
                      <View style={transactionRowStyle}>
                        <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                          {transaction.StatementReference}
                        </Typography.Text>
                        <View style={styles.roundAlign}>
                          <Typography.Text
                            color={transaction.CreditDebitIndicator !== "Debit" ? "successBase" : "neutralBase+30"}
                            size="callout"
                            weight="semiBold">
                            <FormatTransactionAmount
                              amount={parseFloat(transaction.Amount.Amount)}
                              isPlusSignIncluded={transaction.CreditDebitIndicator !== "Debit"}
                              color={transaction.CreditDebitIndicator !== "Debit" ? "successBase" : "neutralBase+30"}
                              integerSize="callout"
                              decimalSize="footnote"
                              isCurrencyIncluded={false}
                            />
                          </Typography.Text>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            );
          }}
        />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  currency: {
    paddingStart: 2,
  },
  header: {
    backgroundColor: palette.primaryBase,
  },
  roundAlign: {
    alignItems: "flex-end",
    flexDirection: "column",
    flex: 1,
  },
  roundUpContainer: {
    flexDirection: "column",
  },
  spliterStyle: {
    alignItems: "baseline",
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
  },
});
