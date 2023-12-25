import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ViewStyle } from "react-native";

import { AngleDownIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import SvgIcon from "@/components/SvgIcon/SvgIcon";
import { useThemeStyles } from "@/theme";

import { Account } from "../../types";
import FormattedPrice from "../FormattedPrice";

interface AccountSelectorProps {
  testID?: string;
  selectedCard: Account;
  openModal?: () => void;
  editable?: boolean;
}

export default function AccountSelector({ testID, selectedCard, editable = true, openModal }: AccountSelectorProps) {
  const { t } = useTranslation();

  const sourceContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    alignItems: "center",
    borderRadius: theme.radii.medium,
    padding: theme.spacing["16p"],
  }));

  return (
    <>
      {editable ? (
        <Pressable onPress={openModal} testID={testID}>
          <Stack direction="horizontal" style={sourceContainerStyle} align="stretch" justify="space-between" gap="16p">
            <Stack direction="horizontal" gap="16p" align="center">
              {/* TODO : update after api get ready */}
              {typeof selectedCard.Logo === "string" ? (
                <SvgIcon uri={selectedCard.Logo || ""} width={40} height={40} />
              ) : (
                <Image source={selectedCard.Logo} />
              )}
              <Stack direction="vertical" gap="4p">
                <Typography.Text color="neutralBase-20" size="caption1" weight="medium">
                  {t("AllInOneCard.TopUpAndRefundScreen.availableBalance")}
                </Typography.Text>
                <FormattedPrice price={selectedCard.Balance} currency={selectedCard.CurrencyCode} />
              </Stack>
            </Stack>
            <AngleDownIcon />
          </Stack>
        </Pressable>
      ) : (
        <Stack direction="horizontal" style={sourceContainerStyle} align="stretch" justify="space-between" gap="16p">
          <Stack direction="horizontal" gap="16p" align="center">
            {/* TODO : update after api get ready */}
            {typeof selectedCard.Logo === "string" ? (
              <SvgIcon uri={selectedCard.Logo || ""} width={40} height={40} />
            ) : (
              <Image source={selectedCard.Logo} />
            )}
            <Stack direction="vertical" gap="4p">
              <Typography.Text color="neutralBase-20" size="caption1" weight="medium">
                {t("AllInOneCard.TopUpAndRefundScreen.availableBalance")}
              </Typography.Text>
              <FormattedPrice price={selectedCard.Balance} currency={selectedCard.CurrencyCode} />
            </Stack>
          </Stack>
        </Stack>
      )}
    </>
  );
}
