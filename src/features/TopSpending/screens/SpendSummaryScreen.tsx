import { endOfMonth, endOfWeek, endOfYear, format, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import { toString } from "lodash";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CalendarAltIcon, ChevronRightIcon } from "@/assets/icons";
import FormatTransactionAmount from "@/components/FormatTransactionAmount";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useTransactions from "@/hooks/use-transactions";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import ShoppingCartIcon from "../assets/icons/ShoppingCartIcon";

export default function SpendSummaryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const SelectedTimeTypes = {
    WEEK: t("TopSpending.SpendSummaryScreen.week"),
    MONTH: t("TopSpending.SpendSummaryScreen.month"),
    YEAR: t("TopSpending.SpendSummaryScreen.year"),
    DAY: t("TopSpending.SpendSummaryScreen.day"),
  } as const;

  type SelectedTime = (typeof SelectedTimeTypes)[keyof typeof SelectedTimeTypes];

  const [fromDate, setFromDate] = useState(toString(startOfMonth(new Date())));
  const [toDate, setToDate] = useState(toString(endOfMonth(new Date())));

  const {
    transactions,
    //  isLoading
  } = useTransactions(undefined, "2", undefined, undefined, fromDate, toDate);

  const defaultMonth = format(startOfMonth(new Date()), "MMMM yyyy");

  const [selectedTime, setSelectedTime] = useState<SelectedTime>(t("TopSpending.SpendSummaryScreen.month"));
  const [currentValue, setCurrentValue] = useState(defaultMonth);

  const totalSum = useMemo(() => {
    if (Array.isArray(transactions?.data?.Transaction)) {
      const sum =
        transactions?.data?.Transaction.reduce((runningTotal: number, transaction) => {
          const transactionAmount = parseFloat(transaction.Amount.Amount);
          return runningTotal + transactionAmount;
        }, 0) || 0;
      return sum;
    } else {
      return 0;
    }
  }, [transactions]);

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleSelection = (time: SelectedTime) => {
    setSelectedTime(time);

    let val, start, end;
    const now = new Date();
    switch (time) {
      case t("TopSpending.SpendSummaryScreen.week"):
        start = format(startOfWeek(now), "yyyy-MM-dd");
        end = format(endOfWeek(now), "yyyy-MM-dd");
        val = `${format(startOfWeek(now), "dd")} - ${format(endOfWeek(now), "dd MMMM yyyy")}`;
        break;
      case t("TopSpending.SpendSummaryScreen.month"):
        start = format(startOfMonth(now), "yyyy-MM-dd");
        end = format(endOfMonth(now), "yyyy-MM-dd");
        val = `${format(startOfMonth(now), "MMMM yyyy")}`;
        break;
      case t("TopSpending.SpendSummaryScreen.year"):
        start = format(startOfYear(now), "yyyy-MM-dd");
        end = format(endOfYear(now), "yyyy-MM-dd");
        val = `${format(startOfYear(now), "yyyy")}`;
        break;
      case t("TopSpending.SpendSummaryScreen.day"):
      default: // "Day"
        start = end = format(now, "yyyy-MM-dd");
        val = format(now, " dd MMMM yyyy");
        break;
    }

    setFromDate(start);
    setToDate(end);

    setCurrentValue(val);
  };

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    paddingHorizontal: theme.spacing["24p"],
    paddingVertical: theme.spacing["8p"],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }));

  const timeFilter = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    marginHorizontal: theme.spacing["32p"],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing["4p"],
  }));

  const contentStyle = useThemeStyles(theme => ({
    backgroundColor: "white",
    paddingHorizontal: theme.spacing["20p"],
    paddingBottom: theme.spacing["37p"],
    marginTop: theme.spacing["16p"],
    flex: 1,
  }));

  const textMargin = useThemeStyles(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const selectedText = useThemeStyles(theme => ({
    borderBottomColor: theme.palette["neutralBase+30"],
    borderBottomWidth: 2,
    paddingBottom: theme.spacing["5p"],
  }));

  const header = useThemeStyles(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
  }));

  const itemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const { chevronColor, giftColor } = useThemeStyles(theme => ({
    chevronColor: theme.palette["neutralBase-20"],
    giftColor: theme.palette["primaryBase-40"],
  }));

  return (
    <Page insets={["top", "left", "right", "bottom"]}>
      <SafeAreaView style={header}>
        <NavHeader
          variant="background"
          onBackPress={handleOnBackPress}
          end={
            <View>
              <CalendarAltIcon />
            </View>
          }
        />
        <View style={headerStyle}>
          <View>
            <Typography.Text color="neutralBase+30" size="title3" weight="medium">
              {/* *TODO make it dynamic data when connect with other screen */}
              Travel
            </Typography.Text>
          </View>
          <Stack direction="horizontal" align="center" gap="4p">
            <Typography.Text size="title3" color="neutralBase+30">
              <FormatTransactionAmount
                amount={totalSum}
                isPlusSignIncluded={false}
                integerSize="title2"
                decimalSize="title2"
                color="neutralBase+30"
                isCurrencyIncluded={false}
              />
            </Typography.Text>
            <Typography.Text color="primaryBase-40">{t("TopSpending.SpendSummaryScreen.sar")}</Typography.Text>
          </Stack>
        </View>
      </SafeAreaView>
      <View style={contentStyle}>
        <View>
          <View style={timeFilter}>
            {[
              t("TopSpending.SpendSummaryScreen.day"),
              t("TopSpending.SpendSummaryScreen.week"),
              t("TopSpending.SpendSummaryScreen.month"),
              t("TopSpending.SpendSummaryScreen.year"),
            ].map(time => (
              <Pressable key={time} onPress={() => handleSelection(time)}>
                <Typography.Text
                  style={selectedTime === time ? selectedText : null}
                  color={selectedTime === time ? "neutralBase+30" : "neutralBase-20"}>
                  {time}
                </Typography.Text>
              </Pressable>
            ))}
          </View>
          <View style={textMargin}>
            <Typography.Text size="title3" color="neutralBase+30">
              {currentValue}
            </Typography.Text>
          </View>
        </View>
        <View style={textMargin}>
          <Typography.Text size="caption1" color="neutralBase">
            {t("TopSpending.SpendSummaryScreen.totalSpending")}
          </Typography.Text>
          <Stack direction="horizontal" align="center" gap="4p">
            <Typography.Text size="title3" color="neutralBase+30">
              <FormatTransactionAmount
                amount={totalSum}
                isPlusSignIncluded={false}
                integerSize="title2"
                decimalSize="title2"
                color="neutralBase+30"
                isCurrencyIncluded={false}
              />
            </Typography.Text>
            <Typography.Text size="title3" weight="bold" color="neutralBase+30">
              {t("TopSpending.SpendSummaryScreen.sar")}
            </Typography.Text>
          </Stack>
        </View>
        <View style={textMargin}>
          <Typography.Text size="title3" color="neutralBase+30">
            {t("TopSpending.SpendSummaryScreen.transactions")}
          </Typography.Text>
        </View>
        {transactions?.data?.Transaction !== undefined ? (
          <FlatList
            data={transactions?.data?.Transaction}
            renderItem={({ item }) => (
              <Stack direction="horizontal" gap="12p" align="center" justify="space-between" style={itemStyle}>
                <ShoppingCartIcon color={giftColor} />
                <Stack direction="vertical" style={styles.expandText}>
                  <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                    {item.StatementReference}
                  </Typography.Text>
                  <Typography.Text size="footnote" color="neutralBase">
                    {format(
                      new Date(item.BookingDateTime[0], item.BookingDateTime[1] - 1, item.BookingDateTime[2]),
                      "dd MMMM yyyy"
                    )}
                  </Typography.Text>
                </Stack>
                <Stack direction="horizontal" align="center" gap="4p">
                  <Typography.Text size="title3" color="neutralBase+30">
                    <FormatTransactionAmount
                      amount={parseFloat(item.Amount.Amount)}
                      isPlusSignIncluded={false}
                      integerSize="callout"
                      decimalSize="callout"
                      color="neutralBase+30"
                      isCurrencyIncluded={false}
                    />
                  </Typography.Text>
                  <Typography.Text size="callout" color="neutralBase+30">
                    {t("TopSpending.SpendSummaryScreen.sar")}
                  </Typography.Text>
                </Stack>
                <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
                  <ChevronRightIcon color={chevronColor} />
                </View>
              </Stack>
            )}
          />
        ) : (
          <View style={styles.textCenter}>
            <Typography.Text size="footnote" color="neutralBase">
              {t("TopSpending.SpendSummaryScreen.emptyTransactions")}
            </Typography.Text>
          </View>
        )}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  expandText: {
    flex: 1,
  },
  textCenter: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
