import { useRoute } from "@react-navigation/native";
import { format, parse } from "date-fns";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View, ViewStyle } from "react-native";

import Divider from "@/components/Divider";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { Chart, ReportCard, SpendingInsightsCategoryCard } from "../components";
import { ChartTypes } from "../enum";
import { useGetMonthsSpendingsComparision } from "../hooks/query-hooks";
import { amountFormatter } from "../utils/amount-formatter";
import { chartDataFormatter } from "../utils/chart-data-formatter";

export default function SpendingComparisonScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute();
  const { monthSpendingsComparison, isMonthSpendingsComparisonSummaryLoading } = useGetMonthsSpendingsComparision(
    params?.comparisonDate
  );

  const monthHeadings = useMemo(() => {
    const basePeriod = monthSpendingsComparison?.Months[0];
    const comparedPeriod = monthSpendingsComparison?.Months[1];
    const baseMonthheading = `${basePeriod?.Month ? getFullMonthNameFromAbbreviation(basePeriod?.Month) : null} ${
      basePeriod?.Year
    }`;
    const comparedMonthHeading = `${
      comparedPeriod?.Month ? getFullMonthNameFromAbbreviation(comparedPeriod?.Month) : null
    } ${comparedPeriod?.Year}`;
    const mainHeading = `${baseMonthheading} - ${comparedMonthHeading}`;
    return { mainHeading, baseMonthheading, comparedMonthHeading };
  }, [monthSpendingsComparison]);

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  function getFullMonthNameFromAbbreviation(abbreviation: string) {
    const date = parse(abbreviation, "MMM", new Date());
    const fullMonthName = format(date, "MMMM");
    return fullMonthName;
  }

  const contentStyle = useThemeStyles(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["32p"],
    flex: 1,
  }));

  const dateHeadingStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    marginBottom: theme.spacing["12p"],
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

  if (isMonthSpendingsComparisonSummaryLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right"]}>
      <NavHeader variant="angled" onBackPress={handleOnBackPress}>
        <NavHeader.BoldTitle color="neutralBase-60">
          {t("TopSpending.TopSpendingScreen.insightsComparison")}
        </NavHeader.BoldTitle>
      </NavHeader>
      <View style={contentStyle}>
        <Typography.Text size="title3" weight="medium" style={dateHeadingStyle} color="neutralBase+30">
          {monthHeadings.mainHeading}
        </Typography.Text>
        <Typography.Text size="caption1" style={totalSpedingTextStyle} color="neutralBase">
          {t("TopSpending.SpendSummaryScreen.totalSpending")}
        </Typography.Text>
        <View style={totalAmountHeadingStyle}>
          <Typography.Text size="title3" weight="bold" color="neutralBase+30">
            {amountFormatter(monthSpendingsComparison?.Total ?? 0)}
          </Typography.Text>
          <Typography.Text size="title3" weight="bold" color="neutralBase+30">
            {" "}
            {t("Currency.sar")}
          </Typography.Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={chartContainerStyle}>
            <Chart
              type={ChartTypes.MONTHLY}
              data={chartDataFormatter(
                monthSpendingsComparison?.Months[0].GraphData ?? [],
                monthSpendingsComparison?.Months[1].GraphData ?? []
              )}
            />
          </View>
          <Divider color="neutralBase-40" height={4} />
          <View style={componentContainerStyle}>
            <ReportCard
              color="primaryBase-40"
              label={monthHeadings.baseMonthheading}
              amount={amountFormatter(monthSpendingsComparison?.Months[0].Total ?? 0)}
            />
            <ReportCard
              color="complimentBase"
              label={monthHeadings.comparedMonthHeading}
              amount={amountFormatter(monthSpendingsComparison?.Months[1].Total ?? 0)}
            />
          </View>
          <Divider color="neutralBase-40" height={4} />
          <SpendingInsightsCategoryCard
            categories={monthSpendingsComparison?.Months[0].Categories ?? []}
            label={monthHeadings.baseMonthheading}
            iconColor="primaryBase-40"
          />
          <Divider color="neutralBase-40" height={4} />
          <SpendingInsightsCategoryCard
            iconColor="complimentBase"
            categories={monthSpendingsComparison?.Months[1].Categories ?? []}
            label={monthHeadings.comparedMonthHeading}
          />
        </ScrollView>
      </View>
    </Page>
  );
}
