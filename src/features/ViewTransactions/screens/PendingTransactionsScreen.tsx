import { RouteProp, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useTransactions from "@/hooks/use-transactions";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AnimatedHeader, FormatTransactionAmount } from "../components";
import { pendingMocksData } from "../mocks";

interface Transaction {
  AccountId: string;
  TransactionReference: string;
  TransactionInformation?: string;
  Amount: {
    Amount: string;
  };
  SupplementaryData: {
    FromDate: [
      number, // year
      number, // month
      number, // day
      number, // hour
      number // minute
    ];
  };
}

export default function PendingTransactionsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const route = useRoute<RouteProp<AuthenticatedStackParams, "ViewTransactions.TransactionsScreen">>();

  const cardId = route.params.cardId;
  const createDisputeUserId = route.params.createDisputeUserId;

  const { pendingTransactions, isLoading } = useTransactions();

  const headerHeight = useRef(new Animated.Value(104)).current;
  const currFont = useRef(new Animated.Value(34)).current;
  const sarFont = useRef(new Animated.Value(22)).current;
  const iconSize = useRef(new Animated.Value(56)).current;
  const [flexDir, setFlexDir] = useState("column");
  const transactions: Transaction[] = pendingTransactions.data?.Transaction || [];

  // TODO this function here after the backend done i will remove it

  const handleNavigation = () => {
    navigation.navigate("ViewTransactions.SingleTransactionDetailedScreen", {
      data: pendingMocksData,
      cardId,
      createDisputeUserId,
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const headerHeightValue = offsetY > 0 ? 52 : 104;
    const currFontValue = offsetY > 0 ? 17 : 34;
    const sarFontValue = offsetY > 0 ? 11 : 22;
    const iconSizeValue = offsetY > 0 ? 28 : 56;
    const flexDirection = offsetY > 0 ? "row-reverse" : "column";

    Animated.parallel([
      Animated.timing(headerHeight, {
        toValue: headerHeightValue,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(currFont, {
        toValue: currFontValue,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(sarFont, {
        toValue: sarFontValue,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(iconSize, {
        toValue: iconSizeValue,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
    setFlexDir(flexDirection);
  };

  const contentStyle = useThemeStyles(
    theme => ({
      paddingHorizontal: theme.spacing["20p"],
      marginTop: theme.spacing["24p"],
    }),
    [headerHeight]
  );

  const transactionRow = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing["8p"],
  }));

  const transactionsContainer = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "column",
    marginVertical: theme.spacing["8p"],
  }));

  const emptyPending = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "column",
    marginHorizontal: theme.spacing["24p"],
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  }));

  return (
    <Page>
      <NavHeader title={t("ViewTransactions.PendingTransactionsScreen.title")} />
      <AnimatedHeader
        headerProps={{
          height: headerHeight,
          currFont: currFont,
          sarFont: sarFont,
          iconSize: iconSize,
          flexDir: flexDir,
        }}
        isFilterDisabled={true}
      />
      <Animated.ScrollView scrollEventThrottle={16} onScroll={handleScroll}>
        <View style={contentStyle}>
          {isLoading ? (
            <View style={styles.activityIndicator}>
              <ActivityIndicator color="secondary_blueBase-50" size="large" />
            </View>
          ) : (
            <>
              <View style={transactionsContainer}>
                {transactions.length ? (
                  <View>
                    {transactions.map(transaction => {
                      const [year, month, day, hours, minutes] = transaction.SupplementaryData.FromDate || [];
                      return (
                        <Pressable key={transaction.TransactionReference} onPress={() => handleNavigation()}>
                          <View key={transaction.TransactionReference} style={transactionRow}>
                            <View>
                              <Typography.Text color="neutralBase+30" size="callout" weight="semiBold">
                                {transaction.TransactionInformation}
                              </Typography.Text>
                              {year !== undefined && (
                                <Typography.Text color="neutralBase" size="caption2" weight="regular">
                                  {format(
                                    new Date(year, month - 1, day, hours ?? 0, minutes ?? 0),
                                    "EEE d MMM y',' HH:mm",
                                    {
                                      locale: enUS,
                                    }
                                  )}
                                </Typography.Text>
                              )}
                            </View>
                            <Typography.Text color="neutralBase+30" size="callout" weight="semiBold">
                              {FormatTransactionAmount(parseFloat(transaction.Amount.Amount), false, "neutralBase+30")}
                            </Typography.Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : (
                  <View style={emptyPending}>
                    <Typography.Text color="neutralBase" size="footnote" weight="regular">
                      {t("ViewTransactions.PendingTransactionsScreen.transactionsPending")}
                    </Typography.Text>
                  </View>
                )}
              </View>
              <View style={emptyPending}>
                <Typography.Text color="neutralBase" size="footnote" weight="regular">
                  {t("ViewTransactions.PendingTransactionsScreen.transactionsPending")}
                </Typography.Text>
              </View>
            </>
          )}
        </View>
      </Animated.ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  activityIndicator: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginTop: 200,
  },
});
