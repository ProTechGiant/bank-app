import React from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, ViewStyle } from "react-native";

import { BuyTransferIcon, SellTransferIcon } from "@/assets/icons";
import ArrowIcon from "@/assets/icons/ArrowIcon";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { TransActionType, TransactionType } from "../types";

interface TransactionCardProps {
  openDetailsHandler?: () => void;
  transaction: TransactionType;
}

export default function TransactionCard({ transaction, openDetailsHandler }: TransactionCardProps) {
  const { t } = useTranslation();

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const arrowIconContainerStyle = useThemeStyles<ViewStyle>(() => ({
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  }));

  return (
    <Stack direction="horizontal" align="center" justify="space-between" style={cardContainerStyle} gap="8p">
      <Stack direction="horizontal" gap="16p">
        <Stack direction="vertical" align="flex-start" justify="space-between">
          {transaction.Type === TransActionType.BUY ? <BuyTransferIcon /> : <SellTransferIcon />}
        </Stack>
        <Stack direction="vertical" align="flex-start" justify="space-between">
          <Typography.Text color="neutralBase+30" size="callout" weight="medium">
            {transaction.Weight} {t("GoldWallet.Grams")}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="footnote" weight="regular">
            {/* TODO  will add it to*/}
            {transaction.Type === TransActionType.BUY
              ? t("GoalGetter.GoalsHubScreen.deposit")
              : t("GoalGetter.GoalsHubScreen.transfer")}
          </Typography.Text>
        </Stack>
      </Stack>
      <Stack direction="horizontal" align="center" justify="space-between" gap="4p">
        <Stack direction="vertical" align="flex-end" justify="space-between">
          <Typography.Text
            color={transaction.Type === TransActionType.SELL ? "successBase" : "errorBase"}
            size="callout"
            weight="medium">
            {transaction.Type === TransActionType.BUY ? "-" : "+"} {transaction.TotalAmount}{" "}
            {t("GoalGetter.GoalsHubScreen.SAR")}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="caption2" weight="regular">
            {/* TODO  hour missing from api */}
            {transaction.Date}
          </Typography.Text>
        </Stack>
        <Pressable onPress={openDetailsHandler}>
          <Stack direction="vertical" align="center" justify="space-between" style={arrowIconContainerStyle}>
            <ArrowIcon />
          </Stack>
        </Pressable>
      </Stack>
    </Stack>
  );
}
