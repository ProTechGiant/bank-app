import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ViewStyle } from "react-native";

import { AngleDownIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import FormattedPrice from "../FormattedPrice";

interface AccountSelectorProps {
  testID?: string;
  selectedCard: any;
  openModal: () => void;
}

export default function AccountSelector({ testID, selectedCard, openModal }: AccountSelectorProps) {
  const { t } = useTranslation();
  const ifCurrency: boolean = "CurrencyID" in selectedCard;
  const sourceContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    alignItems: "center",
    borderRadius: theme.radii.medium,
    padding: theme.spacing["16p"],
  }));
  return (
    <Pressable onPress={openModal} testID={testID}>
      <Stack direction="horizontal" style={sourceContainerStyle} align="stretch" justify="space-between" gap="16p">
        <Stack direction="horizontal" gap="16p" align="center">
          {ifCurrency ? <Image source={selectedCard?.CurrencyLogo} /> : <Image source={selectedCard.Logo} />}
          <Stack direction="vertical" gap="4p">
            <Typography.Text color="neutralBase-20" size="caption1" weight="medium">
              {t("AllInOneCard.AddMoneyScreen.availableBalance")}
            </Typography.Text>
            <FormattedPrice
              price={ifCurrency ? selectedCard.CurrencyBalance : selectedCard.Amount}
              currency={t("AllInOneCard.AddMoneyScreen.sar")}
            />
          </Stack>
        </Stack>
        <AngleDownIcon />
      </Stack>
    </Pressable>
  );
}
