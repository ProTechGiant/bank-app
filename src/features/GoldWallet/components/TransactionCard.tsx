import React from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, ViewStyle } from "react-native";

import { ArrowIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { TransactionType } from "../types";

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

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const arrowIconContainerStyle = useThemeStyles<ViewStyle>(() => ({
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  }));

  return (
    <Stack direction="horizontal" align="center" justify="space-between" style={cardContainerStyle} gap="8p">
      <Stack direction="vertical" align="flex-start" justify="space-between">
        <Typography.Text color="neutralBase+30" size="callout" weight="regular">
          {/* TODO will replace actuall data once integrate with api */}
          {transaction.Weight} {t("GoldWallet.Grams")}
        </Typography.Text>
        <Typography.Text color="neutralBase" size="caption2" weight="regular">
          {/* TODO will replace actuall data once integrate with api */}3 Mar 2023, 09:09
          {/* {format(new Date(transaction.Date), "dd MMM yyyy")} */}
        </Typography.Text>
      </Stack>
      <Stack direction="horizontal" align="center" justify="space-between" gap="4p">
        <Stack direction="vertical" align="flex-end" justify="space-between">
          <Typography.Text
            color={transaction.Type === "Sell" ? "successBase" : "complimentBase+20"}
            size="callout"
            weight="regular">
            {transaction.Type === "Sell" ? "+" : "-"} {transaction.Total_amount} {t("GoldWallet.SAR")}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="caption2" weight="regular">
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
