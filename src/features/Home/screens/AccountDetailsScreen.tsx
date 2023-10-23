import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AddIcon, FeedIcon, FolderOpenIcon, TransferVerticalIcon } from "@/assets/icons/";
import { Stack, Typography } from "@/components";
import BankCard from "@/components/BankCard";
import ContentContainer from "@/components/ContentContainer";
import Divider from "@/components/Divider";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { useCards } from "@/hooks/use-cards";
import useTransactions from "@/hooks/use-transactions";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import TransactionCell from "../components/TransactionCell";
import { Transaction, TransactionDetailed } from "../types";

export default function AccountDetailsScreen() {
  const navigation = useNavigation();
  const account = useCurrentAccount();
  const { t } = useTranslation();
  const cardsQuery = useCards();

  const { transactions, isLoading } = useTransactions();
  const pressableIcons = [
    {
      onPress: () => navigation.navigate("AddMoney.AddMoneyStack", { screen: "AddMoney.AddMoneyInfoScreen" }),
      icon: <AddIcon />,
      title: t("Home.AccountDetails.navBar.addMoney"),
    },
    {
      onPress: () =>
        navigation.navigate("InternalTransfers.InternalTransfersStack", {
          screen: "InternalTransfers.PaymentsHubScreen",
        }),
      icon: <TransferVerticalIcon color="#080E53" />,
      title: t("Home.AccountDetails.navBar.transfers"),
    },
    {
      onPress: () =>
        navigation.navigate("Statements.StatementsStack", {
          screen: "Statements.AccessStatementScreen",
        }),
      icon: <FeedIcon />,
      title: t("Home.AccountDetails.navBar.statements"),
    },
    {
      onPress: () => navigation.navigate("Documents.DocumentsStack"),
      icon: <FolderOpenIcon />,
      title: t("Home.AccountDetails.navBar.documents"),
    },
  ];

  const handleOnSeeAllTransactions = () => {
    navigation.navigate("ViewTransactions.ViewTransactionsStack", {
      screen: "ViewTransactions.TransactionsScreen",
      params: {
        cardId: "8", // this is temporary
        createDisputeUserId: "8", // this is temporary
      },
    });
  };

  const handleOnCardPress = (cardId: string) => {
    navigation.navigate("CardActions.CardDetailsScreen", { cardId });
  };

  const handleOnNavigationPress = (transaction: Transaction) => {
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
        cardId: "8", // this is temporary
        createDisputeUserId: "8", // this is temporary
      },
    });
  };

  const listContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["16p"],
  }));

  const contentContainer = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
  }));
  const sectionTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing["16p"],
  }));

  const sectionTitleMargin = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["32p"],
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["12p"],
    alignItems: "center",
    flex: 1,
  }));

  const navigationListStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["32p"],
  }));

  const iconViewStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["12p"],
    backgroundColor: "white",
    width: 56,
    height: 56,
    borderRadius: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(40, 47, 134, 0.10)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    elevation: 5,
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader title={t("Home.AccountDetails.navHeader")} />
        <ContentContainer isScrollView style={contentContainer}>
          <Stack direction="vertical" align="center">
            <Typography.Text color="neutralBase+10" size="footnote">
              {t("Home.AccountDetails.Accounts.balance")}
            </Typography.Text>
            <Stack direction="horizontal" style={{ right: -12 }}>
              <Typography.Text color="neutralBase+30" weight="semiBold" size="xlarge">
                {account.data?.balance?.toLocaleString("en-US")}
              </Typography.Text>
              <Typography.Text color="neutralBase+10" size="footnote">
                {t("Home.AccountDetails.Accounts.SAR")}
              </Typography.Text>
            </Stack>
            <Typography.Text color="neutralBase+10" size="callout">
              {account.data?.id}
            </Typography.Text>
          </Stack>
          <Stack direction="horizontal" style={navigationListStyle}>
            {pressableIcons.map(({ onPress, icon, title }) => (
              <Pressable onPress={onPress} style={containerStyle}>
                <View style={iconViewStyle}>{icon}</View>
                {title !== undefined ? (
                  <Typography.Text color="neutralBase+30" size="footnote" weight="medium" align="center">
                    {title}
                  </Typography.Text>
                ) : null}
              </Pressable>
            ))}
          </Stack>

          <Divider color="neutralBase-30" />

          {cardsQuery?.data?.Cards?.map?.(card => (
            <View style={sectionTitleMargin}>
              <View style={sectionTitleStyle}>
                <Typography.Text color="neutralBase+30" size="title3" weight="bold">
                  {t("Home.AccountDetails.Cards.title")}
                </Typography.Text>
              </View>

              <ScrollView horizontal bounces={false} showsHorizontalScrollIndicator={false}>
                <BankCard.Active
                  key={card.CardId}
                  cardNumber={card.LastFourDigits}
                  cardType={card.CardType}
                  productId={card.ProductId}
                  onPress={() => handleOnCardPress(card.CardId)}
                  label={t("CardActions.singleUseCard")}
                  testID={`Home.AccountDetailsScreen:SingleUseCard-${card.CardId}`}
                />
              </ScrollView>
            </View>
          ))}

          {cardsQuery?.data?.Cards?.length ? <Divider color="neutralBase-30" /> : null}

          <View style={sectionTitleMargin}>
            <View style={sectionTitleStyle}>
              <Typography.Text color="neutralBase+30" size="title3" weight="bold">
                {t("Home.AccountDetails.Transactions.title")}
              </Typography.Text>
              {transactions.data && transactions.data?.Transaction?.length > 3 ? (
                <Pressable onPress={handleOnSeeAllTransactions}>
                  <Typography.Text size="footnote" weight="medium" color="primaryBase">
                    {t("Home.AccountDetails.Transactions.seeAll")}
                  </Typography.Text>
                </Pressable>
              ) : null}
            </View>
            {isLoading ? (
              <View style={styles.activityIndicator} testID="Viewtransactions.TransactionsScreen:LoadingIndicator">
                <ActivityIndicator color="primaryBase" size="large" />
              </View>
            ) : transactions.data && transactions.data?.Transaction ? (
              <FlatList
                data={transactions.data.Transaction?.slice(0, 3)}
                renderItem={({ item }) => (
                  <TransactionCell transaction={item} onPress={() => handleOnNavigationPress(item)} />
                )}
                keyExtractor={(item, index) => `key ${index}`}
                showsVerticalScrollIndicator={false}
                style={listContainerStyle}
              />
            ) : (
              <View style={styles.activityIndicator} testID="Viewtransactions.TransactionsScreen:NoTransactionsYet">
                <Typography.Text color="neutralBase" size="footnote" weight="regular">
                  {t("ViewTransactions.TransactionsScreen.noTransactionsYet")}
                </Typography.Text>
              </View>
            )}
          </View>
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  activityIndicator: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginTop: 30,
  },
});
