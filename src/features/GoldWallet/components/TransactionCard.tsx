import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { ArrowIcon } from "../assets/ArrowIcon";

interface TransactionCardProps {
  isClickable?: boolean;
  openDetailsHandler?: () => void;
}

export default function TransactionCard({ isClickable = false, openDetailsHandler }: TransactionCardProps) {
  const { t } = useTranslation();

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  return (
    <Stack direction="horizontal" align="center" justify="space-between" style={cardContainerStyle} gap="8p">
      <Stack direction="vertical" align="center" justify="space-between">
        <Typography.Text color="neutralBase+30" size="callout" weight="regular">
          {/* TODO will replace actuall data once integrate with api */}
          4.05 {t("GoldWallet.Grams")}
        </Typography.Text>
        <Typography.Text color="neutralBase" size="caption2" weight="regular">
          {/* TODO will replace actuall data once integrate with api */}3 Mar 2023, 09:09
        </Typography.Text>
      </Stack>
      <Stack direction="horizontal" align="center" justify="space-between" gap="4p">
        <Stack direction="vertical" align="center" justify="space-between">
          <Typography.Text color="successBase" size="callout" weight="regular">
            {/* TODO will replace actuall data once integrate with api */}+ 1900 {t("GoldWallet.SAR")}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="caption2" weight="regular">
            {t("GoldWallet.sell")}
          </Typography.Text>
        </Stack>
        {isClickable ? (
          <Pressable onPress={openDetailsHandler}>
            <Stack direction="vertical" align="center" justify="space-between">
              <ArrowIcon />
            </Stack>
          </Pressable>
        ) : null}
      </Stack>
    </Stack>
  );
}
