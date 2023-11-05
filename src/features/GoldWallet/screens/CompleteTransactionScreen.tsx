import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import Page from "@/components/Page";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CompleteTransactionIcon } from "../assets";
import { TransactionTypeEnum } from "../types";

export default function CompleteTransactionScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const {
    params: { transactionType, walletId },
  } = useRoute<RouteProp<AuthenticatedStackParams, "GoldWallet.CompleteTransactionScreen">>();

  const handleOnDoneButtonPress = () => {
    navigation.navigate("GoldWallet.HubScreen");
  };

  const handleOnViewTransactionsPress = () => {
    navigation.navigate("GoldWallet.TransactionsScreen", {
      walletId: walletId,
    });
  };

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    padding: theme.spacing["20p"],
    width: "100%",
  }));

  const viewTransactionButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
  }));
  return (
    <Page>
      <Stack direction="vertical" style={contentContainerStyle} gap="16p">
        <CompleteTransactionIcon />
        <Typography.Text size="xlarge" weight="semiBold" align="center">
          {t("GoldWallet.CompletedTransactionScreen.gold")}{" "}
          {transactionType === TransactionTypeEnum.BUY
            ? t("GoldWallet.CompletedTransactionScreen.purchased")
            : t("GoldWallet.CompletedTransactionScreen.sold")}{" "}
          {t("GoldWallet.CompletedTransactionScreen.successfully")}
        </Typography.Text>
        <Typography.Text align="center">
          {t("GoldWallet.CompletedTransactionScreen.transactionHistory")}
        </Typography.Text>
        <View style={styles.fullWidth}>
          <Button onPress={handleOnDoneButtonPress}>
            <Typography.Text color="neutralBase-60">{t("GoldWallet.CompletedTransactionScreen.done")}</Typography.Text>
          </Button>
        </View>
        <Pressable onPress={handleOnViewTransactionsPress} style={viewTransactionButtonStyle}>
          <Typography.Text color="successBase">
            {t("GoldWallet.CompletedTransactionScreen.viewTransactions")}
          </Typography.Text>
        </Pressable>
      </Stack>
    </Page>
  );
}
const styles = StyleSheet.create({
  fullWidth: {
    width: "100%",
  },
});
