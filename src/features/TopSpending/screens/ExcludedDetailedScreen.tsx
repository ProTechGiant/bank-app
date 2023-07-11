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
    undefined,
    undefined,
    !categoryId ? true : false
  );

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    backgroundColor: theme.palette["neutralBase-40"],
  }));

  const listContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["16p"],
  }));
  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader onBackPress={handleOnBackPress} />
      {/* This information is temporary until the API is ready  */}
      <Stack direction="horizontal" align="center" justify="space-between" style={headerStyle}>
        <Typography.Text size="title2" color="neutralBase+30">
          {categoryName ? categoryName : "Hidden"}
        </Typography.Text>
        <Typography.Text size="title2" color="neutralBase+30">
          {formatCurrency(totalAmount)}
          <Typography.Text size="body" color="primaryBase-40">
            {t("TopSpending.ExcludedDetailedScreen.sar")}
          </Typography.Text>
        </Typography.Text>
      </Stack>
      <Stack direction="vertical" gap="32p" align="stretch" style={listContainerStyle}>
        {!isLoading ? (
          <FlatList
            data={transactions.data?.Transaction ?? []}
            renderItem={({ item }) => <TransactionCell transaction={item} />}
            keyExtractor={(item, index) => `key ${index}`}
          />
        ) : (
          <FlexActivityIndicator />
        )}
      </Stack>
    </Page>
  );
}
