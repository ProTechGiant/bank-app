import React from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, ViewStyle } from "react-native";

import { LocalTransferIcon } from "@/assets/icons";
import ArrowIcon from "@/assets/icons/ArrowIcon";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface TransactionCardProps {
  openDetailsHandler?: () => void;
}

export default function TransactionCard({ openDetailsHandler }: TransactionCardProps) {
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
          <LocalTransferIcon />
        </Stack>
        <Stack direction="vertical" align="flex-start" justify="space-between">
          <Typography.Text color="neutralBase+30" size="callout" weight="medium">
            {/* TODO will replace actuall data once integrate with api */}
            Portfolio 1
          </Typography.Text>
          <Typography.Text color="neutralBase" size="footnote" weight="regular">
            {/* TODO will replace actuall data once integrate with api */}Deposit
          </Typography.Text>
        </Stack>
      </Stack>
      <Stack direction="horizontal" align="center" justify="space-between" gap="4p">
        <Stack direction="vertical" align="flex-end" justify="space-between">
          <Typography.Text color="neutralBase+30" size="callout" weight="medium">
            {/* TODO will replace actuall data once integrate with api */}
            +100.00 {t("GoldWallet.SAR")}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="caption2" weight="regular">
            {/* TODO will replace actuall data once integrate with api */}
            10-03-2023 | 20:45
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
