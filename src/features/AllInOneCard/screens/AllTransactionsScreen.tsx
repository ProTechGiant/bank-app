import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, View, ViewStyle } from "react-native";

import { FilterIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { SpendingBarChart } from "../components";
import EmptyTranslations from "../components/EmptyTranslations";
import FiltersModal from "../components/FiltersModal";
import TransactionSectionItem from "../components/TransactionSectionItem";
import { mockTransactions as transactions } from "../mocks";
import { TransactionItem } from "../types";

export default function AllTransactionsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionItem[]>(transactions);
  const isTransactionsFound = transactions !== undefined;

  const handleViewTransactionDetails = (transactionItem: TransactionItem) =>
    navigation.navigate("AllInOneCard.TransactionDetailsScreen", { transactionDetails: transactionItem });

  const handleOpenFilterModal = () => setIsFilterModalVisible(true);

  const handleCloseFilterModal = () => setIsFilterModalVisible(false);

  const allTransactionsStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
    flex: 1,
  }));

  const filterIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader title={t("AllInOneCard.AllTransactionsScreen.title")} />
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
          <Pressable onPress={handleOpenFilterModal}>
            <Stack direction="horizontal" align="center" gap="8p">
              <Typography.Text size="footnote" weight="medium" color="complimentBase">
                {t("AllInOneCard.AllTransactionsScreen.allTransactions.filterBy")}
              </Typography.Text>
              <FilterIcon color={filterIconColor} />
            </Stack>
          </Pressable>
        </Stack>

        {isTransactionsFound ? (
          <View style={allTransactionsStyle}>
            <FlatList
              data={filteredTransactions}
              renderItem={({ item }) => (
                <TransactionSectionItem
                  id={item.TransactionId}
                  key={item.TransactionId}
                  MerchantName={item.MerchantName}
                  amount={item.Amount}
                  TransactionDate={item.TransactionDate}
                  TransactionType={item.TransactionType}
                  onPress={() => handleViewTransactionDetails(item)}
                />
              )}
              keyExtractor={item => item.TransactionId}
            />
          </View>
        ) : (
          <EmptyTranslations />
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
