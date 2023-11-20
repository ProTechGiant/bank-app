import { RouteProp, useRoute } from "@react-navigation/native";
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  parse,
  parseISO,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { CalendarAltIcon, ChevronRightIcon } from "@/assets/icons";
import FormatTransactionAmount from "@/components/FormatTransactionAmount";
import IconGenerator from "@/components/IconGenerator";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useTransactions from "@/hooks/use-transactions";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { SingleChart, SpendingsFilterModal } from "../components";
import SpendCompareModal from "../components/SpendCompareModal";
import { ChartTypes, CompareDurationTypes, IntervalTypes } from "../enum";
import { useCategoryGraph } from "../hooks/query-hooks";
import { categoryIconViewBox } from "../mocks/MockData";
import { CompareDatesTypes, DWMData, PeriodDateTypes, Transaction, TransactionDetailed, YearData } from "../types";
import { convertDataToChartDataset } from "../utils/convert-graph-data-to-chart-dataset";

export default function SpendSummaryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "TopSpending.SpendSummaryScreen">>();

  const SelectedTimeTypes = {
    WEEK: t("TopSpending.SpendSummaryScreen.week"),
    MONTH: t("TopSpending.SpendSummaryScreen.month"),
    YEAR: t("TopSpending.SpendSummaryScreen.year"),
    DAY: t("TopSpending.SpendSummaryScreen.day"),
  } as const;

  type SelectedTime = (typeof SelectedTimeTypes)[keyof typeof SelectedTimeTypes];

  const startMonth = route.params?.startDate ?? format(startOfMonth(new Date()), "yyyy-MM-dd");
  const endMonth = route.params?.endDate ?? format(endOfMonth(new Date()), "yyyy-MM-dd");
  const [chartType, setChartType] = useState<ChartTypes | null>(null);
  const [compareDates, setCompareDates] = useState<CompareDatesTypes>({
    firstDate: { endDate: new Date().toString(), startDate: new Date().toString() },
    lastDate: { endDate: new Date().toString(), startDate: new Date().toString() },
  });
  const [fromDate, setFromDate] = useState(startMonth);
  const [toDate, setToDate] = useState(endMonth);

  const [selectedTime, setSelectedTime] = useState<SelectedTime>(t("TopSpending.SpendSummaryScreen.month"));
  const parsedDate = parse(startMonth, "yyyy-MM-dd", new Date());
  const defaultMonth = format(parsedDate, "MMMM yyyy");
  const currentMonth = format(new Date(), "MMMM yyyy");
  const [currentValue, setCurrentValue] = useState(defaultMonth);

  const [isComparing, setIsComparing] = useState(false);
  const [isCurrentMonth, setIsCurrentMonth] = useState(!route.params.startDate || defaultMonth === currentMonth);
  const [isViewingFilter, setIsViewingFilter] = useState(false);
  const [modalSelectionMade, setModalSelectionMade] = useState(false);
  const [chartData, setChartData] = useState<DWMData | YearData | null>(null);
  const [dayWeekMonthchartData, setDayWeekMonthchartData] = useState<DWMData | null>(null);
  const [yearChartData, setYearChartData] = useState<YearData | null>(null);
  const [graphInterval, setGraphInterval] = useState<IntervalTypes>(IntervalTypes.DAY_WEEK_MONTH);
  const [selectedInterval, setSelectedInterval] = useState<ChartTypes>(ChartTypes.MONTHLY);

  const cardId = route.params?.cardId;
  const createDisputeUserId = route.params?.createDisputeUserId;
  const categoryName = route.params?.categoryName;
  const categoryId = route.params?.categoryId;
  const iconPath = route.params?.iconPath;
  const hiddenFlag = false;

  const { transactions } = useTransactions(undefined, categoryId, undefined, undefined, fromDate, toDate, hiddenFlag);
  const { data: categoryGraph, isLoading: isGraphLoading } = useCategoryGraph(
    categoryId,
    graphInterval,
    isCurrentMonth ? null : fromDate
  );

  useEffect(() => {
    if (categoryGraph !== undefined && !isGraphLoading) {
      const data = convertDataToChartDataset(categoryGraph, graphInterval);
      if (graphInterval === IntervalTypes.DAY_WEEK_MONTH) {
        setDayWeekMonthchartData(data);
        setChartData(data);
      } else {
        setYearChartData(data);
        setChartData(data);
      }
    }
  }, [categoryGraph, isGraphLoading, graphInterval]);

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

  const handleOnYearPress = () => {
    if (yearChartData) {
      setChartData(yearChartData);
    } else {
      setChartData(null);
      setGraphInterval(IntervalTypes.YEAR);
    }
  };

  const handleSelection = (time: SelectedTime) => {
    setSelectedTime(time);

    let val, start, end, interval;
    const now = new Date();
    switch (time) {
      case t("TopSpending.SpendSummaryScreen.week"):
        start = format(startOfWeek(now), "yyyy-MM-dd");
        end = format(endOfWeek(now), "yyyy-MM-dd");
        val = `${format(startOfWeek(now), "dd")} - ${format(endOfWeek(now), "dd MMMM yyyy")}`;
        interval = ChartTypes.WEEKLY;
        setChartData(dayWeekMonthchartData);
        break;
      case t("TopSpending.SpendSummaryScreen.month"):
        start = format(startOfMonth(now), "yyyy-MM-dd");
        end = format(endOfMonth(now), "yyyy-MM-dd");
        val = `${format(startOfMonth(now), "MMMM yyyy")}`;
        interval = ChartTypes.MONTHLY;
        setChartData(dayWeekMonthchartData);
        break;
      case t("TopSpending.SpendSummaryScreen.year"):
        start = format(startOfYear(now), "yyyy-MM-dd");
        end = format(endOfYear(now), "yyyy-MM-dd");
        val = `${format(startOfYear(now), "yyyy")}`;
        interval = ChartTypes.YEARLY;
        handleOnYearPress();
        break;
      case t("TopSpending.SpendSummaryScreen.day"):
      default: // "Day"
        start = end = format(now, "yyyy-MM-dd");
        val = format(now, " dd MMMM yyyy");
        interval = ChartTypes.DAILY;
        setChartData(dayWeekMonthchartData);
        break;
    }

    setFromDate(start);
    setToDate(end);
    setModalSelectionMade(false);
    setIsComparing(false);
    setCurrentValue(val);
    setSelectedInterval(interval);
  };

  const handleOnPress = (transaction: Transaction) => {
    const obj: TransactionDetailed = {
      cardType: transaction.CardType,
      status: transaction.Status,
      location: transaction.AddressLine ? transaction.AddressLine : undefined,
      title: transaction.MerchantDetails.MerchantName,
      subTitle: transaction.TransactionInformation,
      amount: transaction.Amount.Amount,
      currency: transaction.Amount.Currency,
      transactionDate: transaction.BookingDateTime,
      roundUpsAmount: transaction.SupplementaryData.RoundupAmount,
      categoryName: transaction.SupplementaryData.CategoryName,
      categoryId: transaction.SupplementaryData.CategoryId,
      transactionId: transaction.TransactionId,
      hiddenIndicator: transaction.HiddenIndicator,
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

  const handleCompare = async (date: { firstDate: PeriodDateTypes; lastDate: PeriodDateTypes }, type: string) => {
    setIsComparing(true);
    setIsCurrentMonth(false);
    setCompareDates(date);
    switch (type) {
      case CompareDurationTypes.DAY:
        setChartType(ChartTypes.DAILY);
        break;
      case CompareDurationTypes.WEEK:
        setChartType(ChartTypes.WEEKLY);
        break;
      case CompareDurationTypes.MONTH:
        setChartType(ChartTypes.MONTHLY);
        break;
      case CompareDurationTypes.YEAR:
        setChartType(ChartTypes.YEARLY);
        break;
      default:
    }
  };

  const timeFilter = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    marginHorizontal: theme.spacing["32p"],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing["4p"],
  }));

  const contentStyle = useThemeStyles(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["20p"],
    flex: 1,
  }));

  const filterStyle = useThemeStyles(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["20p"],
    marginTop: theme.spacing["16p"],
  }));

  const textMargin = useThemeStyles(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const selectedIntervalStyle = useThemeStyles(theme => ({
    borderBottomColor: theme.palette["neutralBase+30"],
    borderBottomWidth: 2,
  }));

  const intervalStyle = useThemeStyles(theme => ({
    paddingBottom: theme.spacing["8p"],
  }));

  const itemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const { chevronColor, giftColor } = useThemeStyles(theme => ({
    chevronColor: theme.palette["neutralBase-20"],
    giftColor: theme.palette.complimentBase,
  }));

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    marginVertical: theme.spacing["12p"],
    marginHorizontal: -theme.spacing["20p"],
    height: theme.spacing["4p"],
  }));

  const getViewBox = (iconName: string) => categoryIconViewBox[iconName as keyof typeof categoryIconViewBox];

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right"]}>
      <SpendingsFilterModal
        isCompareModalIncluded={true}
        onCompare={handleCompare}
        isVisible={isViewingFilter}
        onClose={() => setIsViewingFilter(false)}
        onDayPressEvent={(newFromDate, newToDate) => {
          setFromDate(newFromDate);
          setToDate(newToDate);
          setCurrentValue(`${format(parseISO(newFromDate), "dd")} - ${format(parseISO(newToDate), "dd MMMM yyyy")}`);
          setModalSelectionMade(true);
          setIsComparing(false);
          setIsCurrentMonth(false);
        }}
      />

      <NavHeader
        variant="angled"
        onBackPress={handleOnBackPress}
        end={
          <Pressable onPress={() => setIsViewingFilter(true)}>
            <CalendarAltIcon />
          </Pressable>
        }>
        <View>
          <View>
            <Typography.Text color="neutralBase+30" size="title3" weight="medium">
              {categoryName}
            </Typography.Text>
          </View>
          {isComparing ? (
            <Typography.Text size="title2" weight="semiBold">
              {chartType}
            </Typography.Text>
          ) : (
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
              <Typography.Text color="primaryBase-40">{t("TopSpending.SpendSummaryScreen.sr")}</Typography.Text>
            </Stack>
          )}
        </View>
      </NavHeader>
      <ScrollView>
        <View style={filterStyle}>
          {isCurrentMonth ? (
            <View style={timeFilter}>
              {[
                t("TopSpending.SpendSummaryScreen.day"),
                t("TopSpending.SpendSummaryScreen.week"),
                t("TopSpending.SpendSummaryScreen.month"),
                t("TopSpending.SpendSummaryScreen.year"),
              ].map(time => (
                <Pressable
                  style={!isComparing && !modalSelectionMade && selectedTime === time ? selectedIntervalStyle : null}
                  key={time}
                  onPress={() => handleSelection(time)}>
                  <Typography.Text
                    style={intervalStyle}
                    size="callout"
                    weight="medium"
                    color={
                      !isComparing && !modalSelectionMade && selectedTime === time ? "neutralBase+30" : "neutralBase-20"
                    }>
                    {time}
                  </Typography.Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          <View style={textMargin}>
            <Typography.Text size="title3" color="neutralBase+30">
              {currentValue}
            </Typography.Text>
          </View>
        </View>
        {!isComparing ? (
          <View style={contentStyle}>
            <View style={textMargin}>
              {!isGraphLoading && !!chartData ? (
                <SingleChart type={selectedInterval} graph={chartData} />
              ) : (
                <ActivityIndicator size="small" />
              )}
            </View>
            <View style={separatorStyle} />
            <View style={textMargin}>
              <Typography.Text size="title3" color="neutralBase+30">
                {t("TopSpending.SpendSummaryScreen.transactions")}
              </Typography.Text>
            </View>
            {transactions?.data?.Transaction !== undefined ? (
              <FlatList
                data={transactions.data.Transaction}
                renderItem={({ item }) => (
                  <Pressable key={item.TransactionId} onPress={() => handleOnPress(item)}>
                    <Stack direction="horizontal" gap="12p" align="center" justify="space-between" style={itemStyle}>
                      <IconGenerator
                        width={22}
                        height={22}
                        path={iconPath?.replace('d="', "").replace('"', "")}
                        color={giftColor}
                        viewBox={getViewBox(categoryName)}
                      />
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
                          {t("TopSpending.SpendSummaryScreen.sr")}
                        </Typography.Text>
                      </Stack>
                      <View style={styles.chevronContainer}>
                        <ChevronRightIcon color={chevronColor} />
                      </View>
                    </Stack>
                  </Pressable>
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
        ) : chartType ? (
          <SpendCompareModal
            chartType={chartType}
            compareDates={compareDates}
            cardId={cardId}
            createDisputeUserId={createDisputeUserId}
            categoryId={categoryId}
            hiddenFlag={hiddenFlag}
          />
        ) : null}
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  chevronContainer: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  expandText: {
    flex: 1,
  },
  textCenter: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
