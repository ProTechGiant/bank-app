import { format } from "date-fns";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View, ViewStyle } from "react-native";

import Divider from "@/components/Divider";
import FormatTransactionAmount from "@/components/FormatTransactionAmount";
import Typography from "@/components/Typography";
import useTransactions, { ApiNonGroupedTransactionsResponseElement } from "@/hooks/use-transactions";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { ChartTypes } from "../enum";
import { CompareDatesTypes, TransactionDetailed } from "../types";
import { categorizeTransactions } from "../utils/convert-transaction-data-to-chart-dataset";
import Chart from "./Chart";
import ReportCard from "./ReportCard";
import TransactionItem from "./TransactionItem";

interface SpendCompareModalProps {
  chartType: ChartTypes;
  compareDates: CompareDatesTypes;
  cardId: string;
  createDisputeUserId: string;
  categoryId: string;
  hiddenFlag: boolean;
}

export default function SpendCompareModal({
  chartType,
  compareDates,
  cardId,
  createDisputeUserId,
  categoryId,
  hiddenFlag,
}: SpendCompareModalProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { transactions: firstTransaction } = useTransactions(
    undefined,
    categoryId,
    undefined,
    undefined,
    compareDates.firstDate.startDate,
    compareDates.firstDate.endDate,
    hiddenFlag
  );

  const { transactions: secondTransaction } = useTransactions(
    undefined,
    categoryId,
    undefined,
    undefined,
    compareDates.lastDate.startDate,
    compareDates.lastDate.endDate,
    hiddenFlag
  );

  const handleTransactionPress = (transactionItem: ApiNonGroupedTransactionsResponseElement) => {
    const obj: TransactionDetailed = {
      cardType: transactionItem.CardType,
      transactionId: transactionItem.TransactionId,
      status: transactionItem.Status,
      location: transactionItem.AddressLine ? transactionItem.AddressLine : undefined,
      title: transactionItem.MerchantDetails?.MerchantName,
      subTitle: transactionItem.TransactionInformation,
      amount: transactionItem.Amount.Amount,
      currency: transactionItem.Amount.Currency,
      transactionDate: transactionItem.BookingDateTime,
      roundUpsAmount: transactionItem.SupplementaryData.RoundupAmount,
      categoryName: transactionItem.SupplementaryData.CategoryName,
      categoryId: transactionItem.SupplementaryData.CategoryId,
    };

    navigation.navigate("ViewTransactions.ViewTransactionsStack", {
      screen: "ViewTransactions.SingleTransactionDetailedScreen",
      params: {
        data: obj,
        cardId,
        createDisputeUserId,
      },
    });
  };

  const firstTransaction1Amount = useMemo(() => {
    const t1TotalAmount = Array.isArray(firstTransaction.data?.Transaction)
      ? firstTransaction.data?.Transaction.reduce(
          (runningTotal: number, transaction: ApiNonGroupedTransactionsResponseElement) => {
            const transactionAmount = parseFloat(transaction.Amount.Amount);
            return runningTotal + transactionAmount;
          },
          0
        )
      : 0;
    return t1TotalAmount || 0;
  }, [firstTransaction]);

  const chartData = useMemo(() => {
    if (chartType) {
      return categorizeTransactions(
        firstTransaction.data?.Transaction ?? [],
        secondTransaction.data?.Transaction ?? [],
        chartType
      );
    } else return [];
  }, [firstTransaction, secondTransaction, chartType]);

  const heading = useMemo((): string => {
    switch (chartType) {
      case ChartTypes.MONTHLY:
        return (
          format(new Date(compareDates.firstDate.endDate), "MMMM yyyy") +
          " - " +
          format(new Date(compareDates.lastDate.endDate), "MMMM yyyy")
        );
      case ChartTypes.YEARLY:
        return (
          format(new Date(compareDates.firstDate.endDate), "yyyy") +
          " - " +
          format(new Date(compareDates.lastDate.endDate), "yyyy")
        );
      case ChartTypes.WEEKLY:
        return (
          format(new Date(compareDates.firstDate.startDate), "dd") +
          "-" +
          format(new Date(compareDates.firstDate.endDate), "dd MMMM yyyy") +
          " - " +
          format(new Date(compareDates.lastDate.startDate), "dd") +
          "-" +
          format(new Date(compareDates.lastDate.endDate), "dd MMMM yyyy")
        );
      case ChartTypes.DAILY:
        return (
          format(new Date(compareDates.firstDate.endDate), "dd MMMM yyyy") +
          " - " +
          format(new Date(compareDates.lastDate.endDate), "dd MMMM yyyy")
        );
      default:
        return "";
    }
  }, [chartType, compareDates]);

  const secondTransaction2Amount = useMemo(() => {
    const t2TotalAmount = Array.isArray(secondTransaction.data?.Transaction)
      ? secondTransaction.data?.Transaction.reduce(
          (runningTotal: number, transaction: ApiNonGroupedTransactionsResponseElement) => {
            const transactionAmount = parseFloat(transaction.Amount.Amount);
            return runningTotal + transactionAmount;
          },
          0
        )
      : 0;
    return t2TotalAmount || 0;
  }, [secondTransaction]);

  const contentStyle = useThemeStyles(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["32p"],
    // marginTop: theme.spacing["16p"],
    flex: 1,
  }));

  const dateHeadingStyle = useThemeStyles(theme => ({
    marginBottom: theme.spacing["8p"],
  }));
  const totalSpedingTextStyle = useThemeStyles(theme => ({
    marginBottom: theme.spacing["4p"],
  }));

  const totalAmountHeadingStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["16p"],
    flexDirection: "row",
    alignItems: "center",
  }));

  const componentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const chartContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["16p"],
  }));

  return (
    <React.Fragment>
      <View style={contentStyle}>
        <Typography.Text size="title3" style={dateHeadingStyle} color="neutralBase+30">
          {heading}
        </Typography.Text>
        <Typography.Text size="caption1" style={totalSpedingTextStyle} color="neutralBase">
          {t("TopSpending.SpendSummaryScreen.totalSpending")}
        </Typography.Text>
        <View style={totalAmountHeadingStyle}>
          <Typography.Text size="title3" weight="bold" color="neutralBase+30">
            <FormatTransactionAmount
              amount={firstTransaction1Amount + secondTransaction2Amount}
              isPlusSignIncluded={false}
              integerSize="title2"
              decimalSize="title2"
              color="neutralBase+30"
              isCurrencyIncluded={false}
            />
          </Typography.Text>
          <Typography.Text size="title3" weight="bold" color="neutralBase+30">
            {" "}
            {t("Currency.sar")}
          </Typography.Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={chartContainerStyle}>
            <Chart type={chartType} data={chartData} />
          </View>
          <Divider color="neutralBase-40" height={4} />
          <View style={componentContainerStyle}>
            <ReportCard
              color="primaryBase-40"
              label={
                chartType === ChartTypes.WEEKLY
                  ? t("TopSpending.SpendCompareModal.week", { no: 1 })
                  : chartType === ChartTypes.MONTHLY
                  ? format(new Date(compareDates.firstDate.endDate), "MMMM yyyy")
                  : chartType === ChartTypes.YEARLY
                  ? t("TopSpending.SpendCompareModal.year", { no: 1 })
                  : t("TopSpending.SpendCompareModal.day", { no: 1 })
              }
              amount={firstTransaction1Amount}
            />
            <ReportCard
              color="complimentBase"
              label={
                chartType === ChartTypes.WEEKLY
                  ? t("TopSpending.SpendCompareModal.week", { no: 2 })
                  : chartType === ChartTypes.MONTHLY
                  ? format(new Date(compareDates.lastDate.endDate), "MMMM yyyy")
                  : chartType === ChartTypes.YEARLY
                  ? t("TopSpending.SpendCompareModal.year", { no: 2 })
                  : t("TopSpending.SpendCompareModal.day", { no: 2 })
              }
              amount={secondTransaction2Amount}
            />
          </View>
          <Divider color="neutralBase-40" height={4} />
          <Pressable style={componentContainerStyle}>
            <TransactionItem
              label={
                chartType === ChartTypes.WEEKLY
                  ? t("TopSpending.SpendCompareModal.week", { no: 1 })
                  : chartType === ChartTypes.MONTHLY
                  ? format(new Date(compareDates.firstDate.endDate), "MMMM yyyy")
                  : chartType === ChartTypes.YEARLY
                  ? t("TopSpending.SpendCompareModal.year", { no: 1 })
                  : t("TopSpending.SpendCompareModal.day", { no: 1 })
              }
              color="primaryBase-40"
              transaction={firstTransaction?.data?.Transaction}
              handleTransactionPress={handleTransactionPress}
            />
          </Pressable>
          <View style={componentContainerStyle}>
            <TransactionItem
              label={
                chartType === ChartTypes.WEEKLY
                  ? t("TopSpending.SpendCompareModal.week", { no: 2 })
                  : chartType === ChartTypes.MONTHLY
                  ? format(new Date(compareDates.lastDate.endDate), "MMMM yyyy")
                  : chartType === ChartTypes.YEARLY
                  ? t("TopSpending.SpendCompareModal.year", { no: 2 })
                  : t("TopSpending.SpendCompareModal.day", { no: 2 })
              }
              color="complimentBase"
              transaction={secondTransaction?.data?.Transaction}
              handleTransactionPress={handleTransactionPress}
            />
          </View>
        </ScrollView>
      </View>
    </React.Fragment>
  );
}
