import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  I18nManager,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { ChevronRightIcon, CloseIcon, FilterIcon, PendingIcon } from "@/assets/icons";
import { WithShadow } from "@/components";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useTransactions from "@/hooks/use-transactions";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AnimatedHeader, TransactionsList, ViewFilterModal } from "../components";

export default function TransactionsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const route = useRoute<RouteProp<AuthenticatedStackParams, "ViewTransactions.TransactionsScreen">>();

  const cardId = route.params.cardId;
  const createDisputeUserId = route.params.createDisputeUserId;

  const headerHeight = useRef(new Animated.Value(104)).current;
  const currFont = useRef(new Animated.Value(34)).current;
  const sarFont = useRef(new Animated.Value(22)).current;
  const iconSize = useRef(new Animated.Value(56)).current;

  const [isViewingFilter, setIsViewingFilter] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const transactionCode = selectedFilters.includes("SINGLE_USE_CARD_TR")
    ? "SINGLE_USE_CARD_TR"
    : selectedFilters.includes("DEBIT_TR")
    ? "DEBIT_TR"
    : "";

  const categories = selectedFilters.filter(filter => !["SINGLE_USE_CARD_TR", "DEBIT_TR"].includes(filter)).join(",");
  const groupBy = "YES";

  const { transactions, pendingTransactions, isLoading } = useTransactions(
    transactionCode,
    categories,
    selectedFilters,
    groupBy
  );

  const [flexDir, setFlexDir] = useState("column");

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const headerHeightValue = offsetY > 0 ? 52 : 104;
    const currFontValue = offsetY > 0 ? 17 : 34;
    const sarFontValue = offsetY > 0 ? 11 : 22;
    const iconSizeValue = offsetY > 0 ? 28 : 56;
    const felxDirection = offsetY > 0 ? "row-reverse" : "column";

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
    setFlexDir(felxDirection);
  };

  const handleApplyFilter = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  const handlePendingTransactions = () => {
    navigation.navigate("ViewTransactions.PendingTransactionsScreen", { cardId, createDisputeUserId });
  };

  const handleOnTopSpendingInsights = () => {
    navigation.navigate("TopSpending.TopSpendingStack", {
      screen: "TopSpending.TopSpendingScreen",
    });
  };

  const removeFilter = (filter: string) => {
    setSelectedFilters(prevFilters => prevFilters.filter(type => type !== filter));
  };

  useEffect(() => {
    setIsFiltered(selectedFilters.length > 0);
  }, [selectedFilters]);

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const filterCont = useThemeStyles(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["8p"],
    backgroundColor: theme.palette["neutralBase-50"],
  }));

  const selectedFilter = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    color: theme.palette.primaryBase,
    marginRight: theme.spacing["4p"],
    alignItems: "center",
    flexWrap: "wrap",
  }));

  const optionContainer = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.xxlarge,
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["4p"],
    marginHorizontal: theme.spacing["4p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-20"],
    marginBottom: theme.spacing["4p"],
  }));

  const margins = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.palette["neutralBase-40"],
  }));

  const pendingButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    paddingVertical: theme.spacing["16p"],
  }));
  const pendingButtonTextStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));

  const clearFilterCont = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.primaryBase,
    borderRadius: theme.radii.medium,
    height: 38,
    width: 95,
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["8p"],
    justifyContent: "center",
  }));
  const { chevronColor } = useThemeStyles(theme => ({
    chevronColor: theme.palette["neutralBase-20"],
  }));

  const pastTransactionStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["24p"],
    flexDirection: "row",
    justifyContent: "space-between",
  }));

  const navHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
  }));

  type FilterType = "1" | "2" | "3" | "SINGLE_USE_CARD_TR" | "DEBIT_TR" | string;

  const getFilterName = (type: FilterType): string => {
    const filterNames: Record<FilterType, string> = {
      "1": "Food",
      "2": "Transportation",
      "3": "Entertainment",
      SINGLE_USE_CARD_TR: "One-time card",
      DEBIT_TR: "Debit card",
    };
    return filterNames[type];
  };

  return (
    <Page backgroundColor="neutralBase-60" insets={["top", "left", "right"]}>
      <View style={navHeaderStyle}>
        <NavHeader title={t("ViewTransactions.TransactionsScreen.title")} />
      </View>
      <ViewFilterModal
        selectedFilters={selectedFilters}
        onApplyFilter={handleApplyFilter}
        visible={isViewingFilter}
        onClose={() => setIsViewingFilter(false)}
      />
      <AnimatedHeader
        headerProps={{
          height: headerHeight,
          currFont: currFont,
          sarFont: sarFont,
          iconSize: iconSize,
          flexDir: flexDir,
        }}
        isFiltered={isFiltered}
        onPress={() => handleOnTopSpendingInsights()}
      />
      {selectedFilters.length > 0 ? (
        <WithShadow backgroundColor="neutralBase-50" borderRadius="extraSmall">
          <Stack direction="horizontal" align="center" style={filterCont}>
            <Typography.Text color="neutralBase" size="callout" weight="semiBold">
              {t("ViewTransactions.TransactionsScreen.filteredBy")}
            </Typography.Text>
            <View style={selectedFilter}>
              {selectedFilters.map(type => (
                <View style={optionContainer} key={type}>
                  <Text style={selectedFilter}>{getFilterName(type)}</Text>
                  <Pressable onPress={() => removeFilter(type)}>
                    <CloseIcon width={14} height={18} color={palette.primaryBase} />
                  </Pressable>
                </View>
              ))}
            </View>
          </Stack>
        </WithShadow>
      ) : null}
      <Animated.ScrollView scrollEventThrottle={16} onScroll={handleScroll}>
        <View style={contentStyle}>
          {/* this will be shown if there is pending transactions */}
          {pendingTransactions.data && Object.keys(pendingTransactions.data).length > 0 ? (
            <>
              <Pressable style={[margins, styles.pendingButton]} onPress={handlePendingTransactions}>
                <View style={pendingButtonStyle}>
                  <PendingIcon />
                  <Typography.Text color="neutralBase+30" weight="medium" size="callout" style={pendingButtonTextStyle}>
                    {t("ViewTransactions.TransactionsScreen.pending")}
                  </Typography.Text>
                </View>
                <ChevronRightIcon color={chevronColor} />
              </Pressable>
            </>
          ) : null}
          <View style={pastTransactionStyle}>
            <Typography.Text>Past Transactions</Typography.Text>
            <Pressable onPress={() => setIsViewingFilter(true)}>
              <FilterIcon />
            </Pressable>
          </View>
          {isLoading ? (
            <View style={styles.activityIndicator}>
              <ActivityIndicator color="primaryBase" size="large" />
            </View>
          ) : transactions.data && Object.keys(transactions.data).length ? (
            <TransactionsList
              transactionsAll={transactions}
              cardId={cardId}
              createDisputeUserId={createDisputeUserId}
            />
          ) : selectedFilters.length > 0 && transactions.data !== undefined ? (
            <View style={styles.activityIndicator}>
              <Pressable
                onPress={() => {
                  setSelectedFilters([]);
                }}
                style={clearFilterCont}>
                <Typography.Text color="neutralBase-60" size="caption1" weight="semiBold">
                  {t("ViewTransactions.TransactionsScreen.clearFilter")}
                </Typography.Text>
              </Pressable>
              <Typography.Text color="neutralBase" size="footnote" weight="regular">
                {t("ViewTransactions.TransactionsScreen.emptyTransactions")}
              </Typography.Text>
            </View>
          ) : (
            <View style={styles.activityIndicator}>
              <Typography.Text color="neutralBase" size="footnote" weight="regular">
                {t("ViewTransactions.TransactionsScreen.noTransactionsYet")}
              </Typography.Text>
            </View>
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
  pendingButton: {
    transform: [
      {
        scaleX: I18nManager.isRTL ? -1 : 1,
      },
    ],
  },
});
