import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, TextStyle, View, ViewStyle } from "react-native";

import { FilterIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import FormatTransactionAmount from "@/components/FormatTransactionAmount";
import FullScreenLoader from "@/components/FullScreenLoader";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SvgIcon from "@/components/SvgIcon/SvgIcon";
import { useAuthContext } from "@/contexts/AuthContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AllInOneCardParams } from "../AllInOneCardStack";
import { AddMoneyCurrencyIcon, RefundCurrencyIcon, WaveBackground } from "../assets/icons";
import { EmptyTransactions, FiltersModal, RewardsAction, TransactionSectionItem } from "../components";
import { useGetCardTransactions } from "../hooks/query-hooks";
import { CurrencyConversion } from "../mocks";
import { TransactionItem } from "../types";

export default function CurrencyTransactionDetail() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AllInOneCardParams, "AllInOneCard.transactionDetail">>();
  const {
    data: recentTransactions,
    isLoading: isLoadingTransaction,
    mutateAsync: getRecentTransaction,
  } = useGetCardTransactions();
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionItem[]>();
  const { setMyCurrencies, myCurrencies } = useAuthContext();

  useEffect(() => {
    //Todo : remove this mock payload WHEN API is available and this page be activated
    getRecentTransaction({ CardIdentifierId: "12651651", CardIdentifierType: "test" });
  }, [getRecentTransaction]);

  useEffect(() => {
    if (recentTransactions !== undefined) {
      setFilteredTransactions(recentTransactions.CardTransactions);
    }
  }, [recentTransactions]);

  const appBarStyle = useThemeStyles<TextStyle>(theme => ({
    paddingHorizontal: theme.spacing["32p"],
    backgroundColor: theme.palette["neutralBase+30"],
    paddingVertical: theme.spacing["32p"],
  }));

  const { backgroundColor: appBarColor } = useThemeStyles<TextStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+30"],
  }));

  const filterIconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  const allTransactionsStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
    flex: 1,
  }));

  const handleOpenFilterModal = () => setIsFilterModalVisible(true);

  const handleCloseFilterModal = () => setIsFilterModalVisible(false);

  const handleViewTransactionDetails = (transactionItem: TransactionItem) =>
    navigation.navigate("AllInOneCard.TransactionDetailsScreen", { transactionDetails: transactionItem });

  const handleDeleteCurrency = () => {
    setMyCurrencies([...myCurrencies.filter(item => item.CurrencyID !== route.params.currency.CurrencyID)]);
    navigation.goBack();
  };

  return (
    <Page
      testID="AllInOneCard.CurrencyTransactionDetail:page"
      insets={["left", "right", "top"]}
      backgroundColor="neutralBase-60">
      <NavHeader
        withBackButton={true}
        title={route.params.currency.CurrencyCode}
        end={<NavHeader.DeleteEndButton onPress={() => handleDeleteCurrency()} />}
        backgroundColor={appBarColor}
        variant="white"
        testID="AllInOneCard.CurrencyTransactionDetail:NavHeader"
      />

      <Stack direction="vertical" style={appBarStyle} align="center" gap="16p">
        <SvgIcon uri={route.params.currency?.CurrencyLogo || ""} width={40} height={40} />
        <Typography.Text color="neutralBase-30" weight="regular" size="footnote">
          {t("AllInOneCard.CurrencyTransactionDetail.balance")}
        </Typography.Text>
        <Stack direction="vertical" align="center">
          {/* TODO: amount is hardcoded at the moment , will be removed when api is available  */}
          <Stack direction="horizontal" align="baseline">
            <FormatTransactionAmount
              amount={+(route.params.currency?.CurrencyBalance || 0)}
              isPlusSignIncluded={false}
              integerSize="large"
              decimalSize="body"
              color="neutralBase-50"
              isCurrencyIncluded={false}
              currencyColor="neutralBase-30"
            />
            <Typography.Text color="neutralBase-50" size="body" weight="medium">
              {" "}
              {route.params.currency?.CurrencySymbol}
            </Typography.Text>
          </Stack>
          <Typography.Text color="neutralBase-30" weight="regular" size="footnote">
            {route.params.currency?.CurrencyCode ? CurrencyConversion[route.params.currency?.CurrencyCode] : null}
          </Typography.Text>
        </Stack>
        <Stack direction="horizontal" gap="16p">
          {/* TODO : color will be removed when we have new design colors */}
          <RewardsAction
            label={t("AllInOneCard.CurrencyTransactionDetail.actionAddMoney")}
            backgroundColor="#595266"
            icon={<AddMoneyCurrencyIcon />}
          />
          <RewardsAction
            label={t("AllInOneCard.CurrencyTransactionDetail.actionRefund")}
            backgroundColor="#595266"
            icon={<RefundCurrencyIcon />}
          />
        </Stack>
      </Stack>
      <WaveBackground color={appBarColor} width="100%" />

      <ContentContainer>
        <Stack direction="horizontal" justify="space-between">
          <Typography.Text size="title3" weight="medium" color="neutralBase+30">
            {t("AllInOneCard.AllTransactionsScreen.allTransactions.title")}
          </Typography.Text>
          <Pressable onPress={handleOpenFilterModal} testID="AllInOneCard.CurrencyTransactionDetail:OpenFilter">
            <Stack direction="horizontal" align="center" gap="8p">
              <Typography.Text size="footnote" weight="medium" color="neutralBase+30">
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
                    TransactionDate={item.TransactionDate}
                    TransactionType={item.TransactionType}
                    onPress={() => handleViewTransactionDetails(item)}
                  />
                )}
                keyExtractor={item => item.TransactionId}
              />
            </View>
          ) : (
            <EmptyTransactions />
          )
        ) : (
          <FullScreenLoader />
        )}
      </ContentContainer>
      <FiltersModal
        isFilterModalVisible={isFilterModalVisible}
        closeModal={handleCloseFilterModal}
        setFilteredTransactions={setFilteredTransactions}
        showCurrencyTypeFilter={false}
      />
    </Page>
  );
}
