import Clipboard from "@react-native-clipboard/clipboard";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  I18nManager,
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { ChevronLeftIcon, ChevronRightIcon } from "@/assets/icons";
import { QrGenerateIcon } from "@/assets/icons/QrGenerateIcon";
import { Stack, Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import Divider from "@/components/Divider";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import SegmentedControl from "@/components/SegmentedControl";
import { STANDARD_CARD_PRODUCT_ID } from "@/constants";
import { useToasts } from "@/contexts/ToastsContext";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { useCards } from "@/hooks/use-cards";
import useTransactions from "@/hooks/use-transactions";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import DebitCard from "../assets/debit-card.png";
import { CopyAccountIcon, DocumentsIcon, SadadIcon, TopBorder, TransferIcon } from "../assets/icons";
import { AccountDetailsHeaderContent } from "../components";
import TransactionCell from "../components/TransactionCell";
import { Transaction, TransactionDetailed } from "../types";

export default function AccountDetailsScreen() {
  const navigation = useNavigation();
  const account = useCurrentAccount();
  const { t } = useTranslation();

  const { data, refetch, isFetching } = useCards();
  const { transactions, isLoading } = useTransactions();
  const [currentTab, setCurrentTab] = useState<"AccountID" | "IBAN">("AccountID");
  const addToast = useToasts();

  const screenWidth = Dimensions.get("window").width;
  const debitCard = data?.Cards ? data?.Cards?.find(card => card.ProductId === STANDARD_CARD_PRODUCT_ID) : undefined;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleOnCopyPress = () => {
    if (account.data?.id && account.data?.iban) {
      currentTab === "AccountID" ? Clipboard.setString(account.data?.id) : Clipboard.setString(account.data?.iban);
      addToast({
        variant: "confirm",
        message:
          currentTab === "AccountID"
            ? t("Home.AccountDetails.accountNumberCopied")
            : t("Home.AccountDetails.ibanCopied"),
        position: "bottom",
      });
    }
  };

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);

  const pressableIcons = [
    {
      onPress: () => navigation.navigate("SadadBillPayments.SadadBillPaymentStack"),
      icon: <SadadIcon color={iconColor} />,
      title: t("Home.AccountDetails.navBar.pay"),
    },
    {
      onPress: () =>
        navigation.navigate("InternalTransfers.InternalTransfersStack", {
          screen: "Transfers.TrasnfersLandingScreen",
        }),
      icon: <TransferIcon color={iconColor} />,
      title: t("Home.AccountDetails.navBar.transfers"),
    },
    {
      onPress: () => navigation.navigate("Documents.DocumentsStack"),
      icon: <DocumentsIcon color={iconColor} />,
      title: t("Home.AccountDetails.navBar.documents"),
    },
    {
      onPress: () => navigation.navigate("Statements.StatementsStack"),
      icon: <DocumentsIcon color={iconColor} />,
      title: t("Home.AccountDetails.navBar.statements"),
    },
  ];

  const handleOnRefreshBalancePress = () => {
    account.refetch();
  };

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
    navigation.navigate("CardActions.CardActionsStack", {
      screen: "CardActions.CardDetailsScreen",
      params: { cardId: cardId },
    });
  };

  const handleOnNavigationPress = (transaction: Transaction) => {
    const obj: TransactionDetailed = {
      cardType: transaction.CardType,
      status: transaction.Status,
      location: transaction.AddressLine ? transaction.AddressLine : undefined,
      title: transaction.MerchantDetails?.MerchantName,
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
  }));

  const sectionTitleMargin = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["16p"],
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["12p"],
    alignItems: "center",
    flex: 1,
  }));

  const navigationListStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["32p"],
  }));

  const iconViewStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["12p"],
    backgroundColor: theme.palette.primaryBase,
    width: 56,
    height: 56,
    borderRadius: theme.radii.medium,
    justifyContent: "center",
    alignItems: "center",
  }));

  const activityIndicatorStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing["32p"],
  }));

  const navHeaderColor = useThemeStyles(theme => theme.palette.primaryBase);

  const copyIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  const accountNumberStackStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    borderWidth: 1,
    borderRadius: theme.radii.regular,
    borderColor: theme.palette["neutralBase-30"],
    marginTop: theme.spacing["16p"],
  }));

  const debitCardStackStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    left: screenWidth / theme.spacing["12p"],
    top: theme.spacing["32p"],
    width: "80%",
  }));

  const accountIDStackStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));

  const headerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingTop: theme.spacing["20p"],
    backgroundColor: theme.palette.primaryBase,
    paddingBottom: theme.spacing["64p"],
  }));

  return (
    <Page insets={["left", "right"]} backgroundColor="neutralBase-60">
      <NavHeader
        title={t("Home.AccountDetails.navHeader")}
        backgroundAngledColor={navHeaderColor}
        backgroundColor={navHeaderColor}
        variant={Platform.OS === "android" ? "black" : "white"}
        onBackPress={() => {
          navigation.goBack();
        }}
        end={
          <Pressable
            onPress={() => {
              navigation.navigate("InternalTransfers.InternalTransfersStack", {
                screen: "InternalTransfers.GenerateQrScreen",
              });
            }}>
            <QrGenerateIcon color={iconColor} />
          </Pressable>
        }
      />
      <StatusBar backgroundColor={navHeaderColor} barStyle="light-content" />
      <View style={headerViewStyle}>
        <AccountDetailsHeaderContent
          handleOnRefreshBalancePress={handleOnRefreshBalancePress}
          accountBalance={account.data?.balance}
        />
      </View>
      <View style={styles.contentContainerViewStyle}>
        <View style={styles.topBorderStyle}>
          <TopBorder />
        </View>
        <ContentContainer isScrollView>
          <Stack direction="vertical" align="stretch" gap="16p" style={accountNumberStackStyle}>
            <SegmentedControl onPress={value => setCurrentTab(value)} value={currentTab}>
              <SegmentedControl.Item value="AccountID">{t("Home.AccountDetails.tabs.accountID")}</SegmentedControl.Item>
              <SegmentedControl.Item value="IBAN">{t("Home.AccountDetails.tabs.iban")}</SegmentedControl.Item>
            </SegmentedControl>
            <Stack direction="horizontal" justify="space-between" align="center" style={accountIDStackStyle}>
              <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                {account ? (currentTab === "AccountID" ? account.data?.id : account.data?.iban) : ""}
              </Typography.Text>
              <Pressable onPress={handleOnCopyPress}>
                {account ? <CopyAccountIcon color={copyIconColor} /> : null}
              </Pressable>
            </Stack>
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
          <View style={sectionTitleMargin}>
            {isFetching ? (
              <View style={activityIndicatorStyle} testID="Home.AccountDetailsScreen:CardsLoadingIndicator">
                <ActivityIndicator color="primaryBase" size="large" />
              </View>
            ) : debitCard ? (
              <Pressable
                onPress={() => {
                  handleOnCardPress(debitCard.CardId);
                }}>
                <View style={styles.cardStyle}>
                  <Image source={DebitCard} />
                </View>
                <Stack direction="horizontal" align="center" justify="space-between" style={debitCardStackStyle}>
                  <Stack direction="vertical" gap="16p" align="stretch">
                    <Typography.Text color="neutralBase-60" size="callout" weight="medium">
                      {t("Home.AccountDetails.debitCard")}
                    </Typography.Text>
                    <Typography.Text color="neutralBase-60" size="callout" weight="medium">
                      {`****** ${debitCard.CardId.toString().slice(-4)}`}
                    </Typography.Text>
                  </Stack>
                  {!I18nManager.isRTL ? <ChevronRightIcon color={iconColor} /> : <ChevronLeftIcon color={iconColor} />}
                </Stack>
              </Pressable>
            ) : (
              <View style={activityIndicatorStyle} testID="Home.AccountDetailsScreen:NoCardsMessage">
                <Typography.Text color="neutralBase" size="footnote" weight="regular">
                  {t("Home.AccountDetails.Cards.noCardsMessage")}
                </Typography.Text>
              </View>
            )}
          </View>

          {data?.Cards?.length ? <Divider color="neutralBase-30" /> : null}
          <View style={sectionTitleMargin}>
            <View style={styles.sectionTitleStyle}>
              <Typography.Text color="neutralBase+30" size="title3" weight="bold">
                {t("Home.AccountDetails.Transactions.title")}
              </Typography.Text>
              {transactions.data && transactions.data?.Transaction?.length > 3 ? (
                <Pressable onPress={handleOnSeeAllTransactions}>
                  <Typography.Text size="footnote" weight="medium" color="complimentBase">
                    {t("Home.AccountDetails.Transactions.seeAll")}
                  </Typography.Text>
                </Pressable>
              ) : null}
            </View>
            {isLoading ? (
              <View style={activityIndicatorStyle} testID="Viewtransactions.TransactionsScreen:LoadingIndicator">
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
              <View style={activityIndicatorStyle} testID="Viewtransactions.TransactionsScreen:NoTransactionsYet">
                <Typography.Text color="neutralBase" size="footnote" weight="regular">
                  {t("ViewTransactions.TransactionsScreen.noTransactionsYet")}
                </Typography.Text>
              </View>
            )}
          </View>
        </ContentContainer>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  cardStyle: {
    alignItems: "center",
    width: "100%",
  },
  contentContainerViewStyle: { top: -52 },
  sectionTitleStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topBorderStyle: { height: 33, top: 21 },
});
