import { RouteProp, useRoute } from "@react-navigation/native";
import { format, isToday, isYesterday } from "date-fns";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  I18nManager,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FilterIcon } from "@/assets/icons";
import FormatTransactionAmount from "@/components/FormatTransactionAmount";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";
import { formatCurrency } from "@/utils";

import FilterModal from "../components/FilterModal";
import PillsContainer from "../components/PillsContainer";
import { defaultTransactionApiParams, filterObject } from "../constants";
import { useGetTransactionsByAccountId, useSavingsPot } from "../hooks/query-hooks";
import { GoalTransaction, SavingGoalTransaction, SavingGoalTransactionsApiParams } from "../types";

export default function AllTransactionsScreen() {
  const { t } = useTranslation();
  let onEndReachedCalledDuringMomentum = true;
  const filterOptions = Object.keys(filterObject);
  const navigation = useNavigation<AuthenticatedStackParams>();
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const route = useRoute<RouteProp<AuthenticatedStackParams, "SavingsGoals.AllTransactionsScreen">>();

  const [transactionApiParams, setTransactionApiParams] =
    useState<SavingGoalTransactionsApiParams>(defaultTransactionApiParams);
  const { data: savingsPotData } = useSavingsPot(route.params?.PotId ?? "Test ID");
  const {
    data: transactions,
    isError,
    isLoading,
    refetch: refetchTransaction,
  } = useGetTransactionsByAccountId(transactionApiParams);

  const availableBalance = savingsPotData?.AvailableBalanceAmount ?? 0;
  const formattedBalance = parseFloat(String(availableBalance)).toFixed(2);
  const [integerPart, decimalPart] = formattedBalance.split(".");
  const formattedIntegerPart = formatCurrency(Number.parseInt(integerPart, 10));

  const appliedFilters = useMemo(() => {
    return activeFilters.filter(opt => {
      const actives = transactionApiParams.classifiedTransactionType?.split(",");
      return actives?.includes(filterObject[opt]);
    });
  }, [activeFilters, transactionApiParams]);

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

    navigation.navigate("SavingsGoals.TransactionDetailScreen", {
      PotId: route.params.PotId,
      data: obj,
    });
  };

  const handleOnEndReached = () => {
    if (onEndReachedCalledDuringMomentum) return;
    setTransactionApiParams({ ...transactionApiParams, PageNumber: transactionApiParams.PageNumber + 1 });
  };

  const handleOnRefresh = () => {
    setTransactionApiParams(defaultTransactionApiParams);
    refetchTransaction();
  };

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleOptionSelect = (option: string) => {
    setActiveFilters(prevOptions => {
      if (prevOptions.includes(option)) {
        return prevOptions.filter(item => item !== option);
      } else {
        return [...prevOptions, option];
      }
    });
  };

  const handleOnRemoveFilter = (filter: string) => {
    const values = transactionApiParams.classifiedTransactionType
      ?.split(",")
      .filter(item => item !== filterObject[filter])
      .join(",");
    setTransactionApiParams({ ...transactionApiParams, classifiedTransactionType: values });
    setActiveFilters(pre => pre.filter(item => item !== filter));
  };

  const handleOnFilterModalClose = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  };

  const handleOnApplyFilter = (options: string[]) => {
    const values = options.map(opt => filterObject[opt]).join(",");
    setTransactionApiParams({ ...transactionApiParams, classifiedTransactionType: values });
    handleOnFilterModalClose();
  };

  const handleOnClearAll = () => {
    setTransactionApiParams({ ...transactionApiParams, classifiedTransactionType: "" });
    setActiveFilters([]);
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

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Page insets={["left", "right", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor={palette.primaryBase} translucent />
      <SafeAreaView edges={["top"]} style={styles.header}>
        <NavHeader
          onBackPress={handleOnBackPress}
          title={savingsPotData?.GoalName}
          testID="SavingsGoals.AllTransactionsScreen:NavHeader"
        />
        <View style={headerStyle}>
          <Typography.Text style={balanceStyle} size="footnote" weight="regular" color="primaryBase-40">
            {t("SavingsGoals.GoalDetailsScreen.AllTransactions.balance")}
          </Typography.Text>
          <Stack style={styles.balanceContainer} direction="horizontal">
            <View style={styles.spliterStyle}>
              <Typography.Text color="neutralBase-50" size="large">
                {formattedIntegerPart}
              </Typography.Text>
              <Typography.Text color="neutralBase-50" size="title2" weight="bold">
                .{decimalPart ?? "00"}
              </Typography.Text>
              <Typography.Text style={styles.currency} color="primaryBase-40" size="title2">
                {" "}
                {t("Currency.sar")}
              </Typography.Text>
            </View>
            <Pressable onPress={handleOnFilterModalClose}>
              <FilterIcon />
            </Pressable>
          </Stack>
        </View>
      </SafeAreaView>

      {appliedFilters.length ? (
        <PillsContainer onRemoveFilter={handleOnRemoveFilter} appliedFilterLabels={appliedFilters} />
      ) : null}

      <View style={contentStyle}>
        <FlatList
          data={transactions?.GroupedTransactions}
          onEndReached={handleOnEndReached}
          onEndReachedThreshold={1}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum = false;
          }}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleOnRefresh} />}
          renderItem={({ item }) => {
            const sum = item.Transactions.reduce(
              (total, current) =>
                current.CreditDebitIndicator === "Debit"
                  ? total - parseFloat(current.Amount.Amount)
                  : total + parseFloat(current.Amount.Amount),
              0
            );
            return (
              <View testID={`SavingsGoals.AllTransactionsScreen:TransactionItem-${item.Key}`}>
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
        <NotificationModal
          isVisible={isError}
          title={t("SavingsGoals.GoalDetailsScreen.AllTransactions.errorTitle")}
          variant="error"
          message={t("SavingsGoals.GoalDetailsScreen.AllTransactions.errorMessage")}
        />
        <FilterModal
          selectedOptions={activeFilters}
          onSelectOption={handleOptionSelect}
          visible={isFilterModalVisible}
          onClose={handleOnFilterModalClose}
          onApplyFilter={handleOnApplyFilter}
          onClearAll={handleOnClearAll}
          filterOptions={filterOptions}
        />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  balanceContainer: {
    alignItems: "center",
    justifyContent: "space-between",
  },
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
