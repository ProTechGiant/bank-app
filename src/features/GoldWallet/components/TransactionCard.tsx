import React from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { ArrowIcon, NorthWest, SouthWest } from "../assets";
import { TransactionType, TransferType } from "../types";

interface TransactionCardProps {
  isPressable?: boolean;
  openDetailsHandler?: () => void;
  transaction: TransactionType;
}

export default function TransactionCard({
  isPressable = false,
  openDetailsHandler,
  transaction,
}: TransactionCardProps) {
  const { t } = useTranslation();

  const marginIconStyle = useThemeStyles<ViewStyle>(theme => ({
    marginEnd: theme.spacing["16p"],
  }));

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const arrowIconContainerStyle = useThemeStyles<ViewStyle>(() => ({
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  }));

  return (
    <Stack direction="horizontal" align="center" justify="space-between" style={cardContainerStyle} gap="8p">
      <Stack direction="horizontal" align="flex-start">
        <View style={marginIconStyle}>{transaction.Type === "Sell" ? <SouthWest /> : <NorthWest />}</View>
        <Stack direction="vertical" align="flex-start" justify="space-between">
          <Typography.Text color="neutralBase+30" size="callout" weight="regular">
            {transaction.Weight} {t("GoldWallet.Grams")}
          </Typography.Text>
          <Typography.Text color="neutralBase+10" size="caption2" weight="regular">
            {transaction.Type === "Sell" ? TransferType.DEPOSIT : TransferType.TRANSFER}
          </Typography.Text>
        </Stack>
      </Stack>
      <Stack direction="horizontal" align="center" justify="space-between" gap="4p">
        <Stack direction="vertical" align="flex-end" justify="space-between">
          <Typography.Text
            color={transaction.Type === "Sell" ? "successBase" : "errorBase"}
            size="callout"
            weight="regular">
            {transaction.Type === "Sell" ? "+" : "-"} {transaction.Total_amount} {t("GoldWallet.SAR")}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="caption2" weight="regular" style={styles.transactionTypeStyle}>
            {transaction.Type}
          </Typography.Text>
        </Stack>
        {isPressable ? (
          <Pressable onPress={openDetailsHandler}>
            <Stack direction="vertical" align="center" justify="space-between" style={arrowIconContainerStyle}>
              <ArrowIcon />
            </Stack>
          </Pressable>
        ) : null}
      </Stack>
    </Stack>
  );
}

const styles = StyleSheet.create({
  transactionTypeStyle: {
    textTransform: "capitalize",
  },
});
