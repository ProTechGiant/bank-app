import { useTranslation } from "react-i18next";
import { TextStyle, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import EmptyTransactions from "../components/EmptyTranslations";
import { TransactionDetailsNavigationParams, TransactionItem } from "../types";
import { getRecentTransactions } from "../utils/getRecentTransactions";
import TransactionSectionItem from "./TransactionSectionItem";

interface LatestTransactionSectionProps {
  onPressSeeMore: () => void;
  transactions: TransactionItem[];
}

export default function TransactionSection({ onPressSeeMore, transactions }: LatestTransactionSectionProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const recentTransactions: TransactionItem[] = getRecentTransactions(transactions);

  const handleViewTransactionDetails = (transactionItem: TransactionItem) => {
    const params: TransactionDetailsNavigationParams = {
      screen: "AllInOneCard.TransactionDetailsScreen",
      params: { transactionDetails: transactionItem },
    };
    navigation.navigate("AllInOneCard.AllInOneCardStack", params);
  };

  const contentStyles = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
    marginVertical: theme.spacing["16p"],
    flex: 1,
    alignItems: "stretch",
  }));

  const textStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const itemsStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const emptyTransactionsContainerStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["48p"],
  }));

  return (
    <Stack direction="vertical" style={contentStyles}>
      <Stack direction="horizontal" justify="space-between" align="center">
        <Typography.Text size="title3" weight="medium">
          {t("AllInOneCard.Dashboard.transaction")}
        </Typography.Text>
        <Typography.Text
          size="footnote"
          weight="regular"
          style={textStyle}
          onPress={onPressSeeMore}
          color="neutralBase">
          {t("AllInOneCard.Dashboard.viewAll")}
        </Typography.Text>
      </Stack>

      {transactions !== undefined ? (
        <View style={itemsStyle}>
          {recentTransactions.map(item => {
            return (
              <TransactionSectionItem
                key={item.TransactionId}
                MerchantName={item.MerchantName}
                amount={item.Amount}
                TransactionDate={item.TransactionDate}
                TransactionType={item.TransactionType}
                onPress={() => handleViewTransactionDetails(item)}
              />
            );
          })}
        </View>
      ) : (
        <View style={emptyTransactionsContainerStyle}>
          <EmptyTransactions />
        </View>
      )}
    </Stack>
  );
}
