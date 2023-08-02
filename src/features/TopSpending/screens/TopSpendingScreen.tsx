import { format, parseISO, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, Pressable, SectionList, StyleSheet, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { CalendarAltIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import Modal from "@/components/Modal";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import {
  BudgetCard,
  CategoryCell,
  CustomerBalance,
  MonthlyBudget,
  MonthlyBudgetEditForm,
  MonthlyBudgetForm,
  SelectMonthModal,
  SingleChart,
} from "../components";
import { ChartTypes, IntervalTypes } from "../enum";
import {
  useBudgetSummary,
  useCategories,
  useDeleteBudgetSummary,
  useLastSixMonthGraph,
  useTransactionTags,
} from "../hooks/query-hooks";
import { LastSixMonthsType, SingleSelectedMonthType, Tag } from "../types";
import { convertDataToChartDataset } from "../utils/convert-graph-data-to-chart-dataset";

type CategoryProps = {
  categoryId: string;
  categoryName: string;
  iconPath: string;
  totalAmount: number;
  TagId: number;
};

export default function TopSpendingScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isExpandedCategory, setIsExpandedCategory] = useState(false);
  const [isExpandedTag, setIsExpandedTag] = useState(false);
  const [isCreateMonthlyModalOpen, setCreateIsMonthlyModalOpen] = useState(false);
  const [isEditMonthlyModalOpen, setEditIsMonthlyModalOpen] = useState(false);
  const [isSuccessDeleteMessage, setIsSuccessDeleteMessage] = useState(false);

  const [chartData, setChartData] = useState<LastSixMonthsType | null>(null);

  const { data: lastSixMonthGraph, isLoading: isGraphLoading } = useLastSixMonthGraph();
  const [isSelectMonthModalVisible, setIsSelectMonthModalVisible] = useState<boolean>(false);
  const [singleSelectedMonth, setSingleSelectedMonth] = useState<SingleSelectedMonthType>();
  const { includedCategories, total, excludedCategories, isLoading } = useCategories(singleSelectedMonth);
  const { tags, tagsLoading } = useTransactionTags(singleSelectedMonth);
  const { budgetSummary, isBudgetLoading } = useBudgetSummary(singleSelectedMonth);
  const DeleteBudgetSummary = useDeleteBudgetSummary();

  const currentDate = new Date();
  const selectedMonth = singleSelectedMonth?.fromDate ? parseISO(singleSelectedMonth.fromDate) : currentDate;
  const isCurrentMonth = currentDate.getMonth() === selectedMonth.getMonth();
  const monthName = format(selectedMonth, "MMMM");

  useEffect(() => {
    if (lastSixMonthGraph !== undefined && !isGraphLoading) {
      const data = convertDataToChartDataset(lastSixMonthGraph, IntervalTypes.LAST_SIX_MONTH);
      setChartData(data);
    }
  }, [lastSixMonthGraph, isGraphLoading]);

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleOnContinue = (firstDate: string, secondDate?: string) => {
    if (firstDate && !secondDate) {
      // It's mean that user selected just single month
      const monthLastDay = firstDate; // Formatted Date like this: 2021-08-31

      // FirstDate has format like this: 2021-08-31 And we need to convert it to this: 2021-08-01
      const monthStartDay = format(startOfMonth(parseISO(monthLastDay)), "yyyy-MM-dd");
      setSingleSelectedMonth({ fromDate: monthStartDay, toDate: monthLastDay });
    } else if (firstDate && secondDate) {
      // It's mean that user selected just two months for comparison
      navigation.navigate("TopSpending.SpendingComparisonScreen", {
        comparisonDate: [firstDate, secondDate].join(","),
      });
    }
  };

  const handleOnCategoryTransactions = (category: CategoryProps & Tag, screen: string) => {
    if (screen === t("TopSpending.TopSpendingScreen.excludedfromSpending")) {
      navigation.navigate("TopSpending.ExcludedDetailedScreen", {
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        totalAmount: category.totalAmount,
        startDate: singleSelectedMonth?.fromDate,
        endDate: singleSelectedMonth?.toDate,
      });
    } else if (screen === t("TopSpending.TopSpendingScreen.topSpendingByTags")) {
      navigation.navigate("TopSpending.SingleTagScreen", {
        data: category,
        startDate: singleSelectedMonth?.fromDate,
        endDate: singleSelectedMonth?.toDate,
      });
    } else {
      navigation.navigate("TopSpending.SpendSummaryScreen", {
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        iconPath: category.iconPath,
        startDate: singleSelectedMonth?.fromDate,
        endDate: singleSelectedMonth?.toDate,
      });
    }
  };

  const handleOnDeleteSuccessMessage = () => {
    // this setTimeout is here cuz dialog didnt show in ios ;
    setEditIsMonthlyModalOpen(false);
    setTimeout(() => {
      setIsSuccessDeleteMessage(true);
    }, 200);
  };

  const handleOnEditSuccessMessage = () => {
    setEditIsMonthlyModalOpen(false);
  };

  const handleOnDelete = async () => {
    try {
      await DeleteBudgetSummary.mutateAsync(budgetSummary.BudgetId);
      handleOnDeleteSuccessMessage();
    } catch (error) {
      Alert.alert(t("errors.generic.title"), t("errors.generic.message"), [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  };

  const sectionList = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const sectionHeader = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const imagesStyle = useThemeStyles(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["12p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["16p"],
  }));

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["supportBase-15"],
    zIndex: 1,
    marginBottom: theme.spacing["20p"],
  }));
  const secttions = [];
  if (!isLoading && includedCategories) {
    secttions.push({
      data: isExpandedCategory ? includedCategories : includedCategories.slice(0, 3),
      title: t("TopSpending.TopSpendingScreen.topSpendingInMonth") + monthName,
      expandView: includedCategories.length > 3 ? true : false,
      isExpanded: isExpandedCategory,
      onExpand: () => setIsExpandedCategory(!isExpandedCategory),
      isTag: false,
    });
  }
  if (!tagsLoading && tags) {
    secttions.push({
      data: isExpandedTag ? tags : tags.slice(0, 3),
      title: t("TopSpending.TopSpendingScreen.topSpendingByTags"),
      expandView: tags.length > 3 ? true : false,
      isExpanded: isExpandedTag,
      onExpand: () => setIsExpandedTag(!isExpandedTag),
      isTag: true,
    });
  }
  if (!isLoading && excludedCategories) {
    secttions.push({
      data: excludedCategories,
      title: t("TopSpending.TopSpendingScreen.excludedfromSpending"),
      expandView: false,
      isTag: false,
    });
  }

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right"]}>
      <SafeAreaView edges={["top"]} style={headerStyle}>
        <NavHeader
          variant="angled"
          title={t("TopSpending.TopSpendingScreen.spendingInsights")}
          onBackPress={handleOnBackPress}
          end={
            <Pressable onPress={() => setIsSelectMonthModalVisible(true)}>
              <CalendarAltIcon />
            </Pressable>
          }
        />
      </SafeAreaView>
      <Modal
        visible={isCreateMonthlyModalOpen}
        onBack={() => setCreateIsMonthlyModalOpen(false)}
        onClose={() => setCreateIsMonthlyModalOpen(false)}
        headerText="Spending Insights"
        style={styles.modal}>
        <MonthlyBudgetForm onClose={() => setCreateIsMonthlyModalOpen(false)} />
      </Modal>

      <Modal
        visible={isEditMonthlyModalOpen}
        onBack={() => setEditIsMonthlyModalOpen(false)}
        onClose={() => setEditIsMonthlyModalOpen(false)}
        headerText="Spending Insights"
        style={styles.modal}>
        {budgetSummary?.StartDate ? (
          <MonthlyBudgetEditForm
            budgetSummary={budgetSummary}
            handleOnDelete={handleOnDelete}
            onClose={handleOnEditSuccessMessage}
          />
        ) : null}
      </Modal>

      <ContentContainer style={contentContainerStyle}>
        <Stack align="stretch" direction="vertical" gap="16p">
          {isBudgetLoading && !budgetSummary ? (
            <View style={styles.indicatorContainerStyle}>
              <ActivityIndicator />
            </View>
          ) : !isBudgetLoading && budgetSummary?.Amount ? (
            <BudgetCard
              percentage={budgetSummary.ConsumedPercentage}
              amountSpent={budgetSummary.ConsumedAmount}
              budgetAmount={budgetSummary.Amount}
              fromDate={format(
                new Date(budgetSummary.StartDate[0], budgetSummary.StartDate[1] - 1, budgetSummary.StartDate[2]),
                "yyyy-MM-dd"
              )}
              toDate={format(
                new Date(budgetSummary.EndDate[0], budgetSummary.EndDate[1] - 1, budgetSummary.EndDate[2]),
                "yyyy-MM-dd"
              )}
              onPress={() => setEditIsMonthlyModalOpen(true)}
            />
          ) : (
            <>
              {!budgetSummary && budgetSummary !== undefined ? (
                <MonthlyBudget onPress={() => setCreateIsMonthlyModalOpen(true)} />
              ) : null}
            </>
          )}
        </Stack>
      </ContentContainer>

      {!isLoading && total ? (
        <>
          <CustomerBalance month={monthName} total={total} isCurrentMonth={isCurrentMonth} />
          <View style={imagesStyle}>
            <Typography.Text size="title3" weight="semiBold" color="neutralBase+30">
              {t("TopSpending.TopSpendingScreen.lastSixMonth")}
            </Typography.Text>
            {!isGraphLoading && !!chartData ? (
              <SingleChart type={ChartTypes.LAST_SIX_MONTH} graph={chartData} isClickable={true} />
            ) : (
              <ActivityIndicator size="small" />
            )}
          </View>
        </>
      ) : null}

      {!isLoading && !tagsLoading ? (
        <SectionList
          style={sectionList}
          sections={secttions}
          renderItem={({ item, section: { isTag, title } }) => (
            <CategoryCell category={item} isTag={isTag} onPress={() => handleOnCategoryTransactions(item, title)} />
          )}
          keyExtractor={(_item, index) => String(index)}
          renderSectionHeader={({ section: { title, expandView, onExpand, isExpanded } }) => (
            <Stack style={sectionHeader} direction="horizontal" align="center" justify="space-between">
              <Typography.Text size="body" weight="semiBold" color="neutralBase+30">
                {title}
              </Typography.Text>
              {expandView ? (
                <TouchableOpacity onPress={onExpand}>
                  <Typography.Text size="footnote" weight="regular" color="interactionBase">
                    {isExpanded
                      ? t("TopSpending.TopSpendingScreen.seeLess")
                      : t("TopSpending.TopSpendingScreen.seeAll")}
                  </Typography.Text>
                </TouchableOpacity>
              ) : null}
            </Stack>
          )}
        />
      ) : null}

      <SelectMonthModal
        isVisible={isSelectMonthModalVisible}
        onClose={() => setIsSelectMonthModalVisible(false)}
        onContinue={handleOnContinue}
      />
      <NotificationModal
        title={t("TopSpending.TopSpendingScreen.modal.deleteSuccess")}
        isVisible={isSuccessDeleteMessage}
        message={t("TopSpending.TopSpendingScreen.modal.deleteSuccessMessage")}
        onClose={() => setIsSuccessDeleteMessage(false)}
        variant="success"
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  indicatorContainerStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    height: "93%",
  },
});
