import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { FlatList, ViewStyle } from "react-native";

import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useTransactions from "@/hooks/use-transactions";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { TransactionCell } from "../components";
import { Transaction, TransactionDetailed } from "../types";

export default function ExcludedDetailedScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const route = useRoute<RouteProp<AuthenticatedStackParams, "TopSpending.ExcludedDetailedScreen">>();
  const { categoryId, categoryName, totalAmount } = route.params;

  const { transactions, isLoading } = useTransactions(
    undefined,
    categoryId,
    undefined,
    undefined,
    route.params.startDate,
    route.params.endDate,
    !categoryId ? true : false
  );

  const handleOnBackPress = () => {
    navigation.goBack();
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

  const navHeaderBackground = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom"]}>
      <NavHeader variant="angled" backgroundAngledColor={navHeaderBackground} onBackPress={handleOnBackPress}>
        {/* This information is temporary until the API is ready  */}
        <Stack direction="horizontal" align="center" justify="space-between">
          <Typography.Text size="title2" color="neutralBase-60">
            {categoryName ? categoryName : t("TopSpending.ExcludedDetailedScreen.hiddenTransactions")}
          </Typography.Text>
          <Typography.Text size="title2" color="neutralBase-60">
            {formatCurrency(totalAmount)}
            <Typography.Text size="body" color="neutralBase-10">
              {" "}
              {t("Currency.sar")}
            </Typography.Text>
          </Typography.Text>
        </Stack>
      </NavHeader>

      {!isLoading ? (
        <FlatList
          data={transactions.data?.Transaction ?? []}
          renderItem={({ item }) => (
            <TransactionCell transaction={item} onPress={() => handleOnNavigationPress(item)} />
          )}
          keyExtractor={(item, index) => `key ${index}`}
          showsVerticalScrollIndicator={false}
          style={listContainerStyle}
        />
      ) : (
        <FlexActivityIndicator />
      )}
    </Page>
  );
}
