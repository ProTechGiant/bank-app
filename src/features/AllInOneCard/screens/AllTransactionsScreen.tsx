import { format, parse } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, View, ViewStyle } from "react-native";

import { FilterIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { SpendingBarChart } from "../components";
import EmptyTranslations from "../components/EmptyTranslations";
import FiltersModal from "../components/FiltersModal";
import TransactionSectionItem from "../components/TransactionSectionItem";
import { useGetCardTransactions } from "../hooks/query-hooks";
import { TransactionItem } from "../types";

export default function AllTransactionsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {
    data: recentTransactions,
    isLoading: isLoadingTransaction,
    mutateAsync: getRecentTransaction,
  } = useGetCardTransactions();
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionItem[]>();
  useEffect(() => {
    //Todo : remove this mock payload WHEN API is available and this page be activated
    getRecentTransaction({ CardIdentifierId: "12651651", CardIdentifierType: "test" });
  }, [getRecentTransaction]);

  useEffect(() => {
    if (recentTransactions !== undefined) {
      setFilteredTransactions(recentTransactions.CardTransactions);
    }
  }, [recentTransactions]);
  const isTransactionsFound =
    !isLoadingTransaction && filteredTransactions !== undefined && filteredTransactions?.length > 0;

  const handleViewTransactionDetails = (transactionItem: TransactionItem) =>
    navigation.navigate("AllInOneCard.TransactionDetailsScreen", { transactionDetails: transactionItem });

  const handleOpenFilterModal = () => setIsFilterModalVisible(true);

  const handleCloseFilterModal = () => setIsFilterModalVisible(false);

  const allTransactionsStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
    flex: 1,
  }));
  const formatDate = (date: string) => {
    const parsedDate = parse(date, "dd/MM/yyyy", new Date());
    return format(parsedDate, "d MMM yyyy");
  };

  const filterIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <Page backgroundColor="neutralBase-60" testID="AllInOneCard.AllTransactionsScreen:Page">
      <NavHeader
        title={t("AllInOneCard.AllTransactionsScreen.title")}
        testID="AllInOneCard.AllTransactionsScreen:NavHeader"
      />
      <ContentContainer>
        <View>
          <Typography.Text size="title3" weight="medium" color="neutralBase+30">
            {t("AllInOneCard.AllTransactionsScreen.spendingSummary.title")}
          </Typography.Text>
        </View>
        <SpendingBarChart isTransactionsFound={isTransactionsFound} />
        <Stack direction="horizontal" justify="space-between">
          <Typography.Text size="title3" weight="medium" color="neutralBase+30">
            {t("AllInOneCard.AllTransactionsScreen.allTransactions.title")}
          </Typography.Text>
          <Pressable onPress={handleOpenFilterModal} testID="AllInOneCard.AllTransactionsScreen:pressableFilter">
            <Stack direction="horizontal" align="center" gap="8p">
              <Typography.Text size="footnote" weight="medium" color="complimentBase">
                {t("AllInOneCard.AllTransactionsScreen.allTransactions.filterBy")}
              </Typography.Text>
              <FilterIcon color={filterIconColor} />
            </Stack>
          </Pressable>
        </Stack>

        {!isLoadingTransaction && filteredTransactions !== undefined ? (
          filteredTransactions.length > 0 ? (
            <View style={allTransactionsStyle}>
              <FlatList
                data={filteredTransactions}
                renderItem={({ item }) => (
                  <TransactionSectionItem
                    id={item.TransactionId}
                    key={item.TransactionId}
                    MerchantName={item.MerchantName}
                    amount={item.Amount}
                    TransactionDate={formatDate(item.TransactionDate)}
                    TransactionType={item.TransactionType}
                    onPress={() => handleViewTransactionDetails(item)}
                  />
                )}
                testID="AllInOneCard.AllTransactionsScreen:FlatList"
                keyExtractor={item => item.TransactionId}
              />
            </View>
          ) : (
            <EmptyTranslations />
          )
        ) : (
          <FullScreenLoader />
        )}
      </ContentContainer>
      <FiltersModal
        isFilterModalVisible={isFilterModalVisible}
        closeModal={handleCloseFilterModal}
        setFilteredTransactions={setFilteredTransactions}
      />
    </Page>
  );
}
