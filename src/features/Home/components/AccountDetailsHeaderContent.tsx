import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, I18nManager, Pressable, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useTheme, useThemeStyles } from "@/theme";

import { EyeHideFilledIcon, EyeShowFilledIcon } from "../assets/icons";

interface AccountDetailsHeaderContentProps {
  accountBalance?: number;
  handleOnRefreshBalancePress: () => void;
}

export default function AccountDetailsHeaderContent({
  accountBalance,
  handleOnRefreshBalancePress,
}: AccountDetailsHeaderContentProps) {
  const { t } = useTranslation();
  const appTheme = useTheme();

  const formatter = Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 2 });
  const balance = accountBalance ?? 0;
  const formattedBalance = formatter.format(balance);
  const [dollars, cents] = formattedBalance.split(".");
  const [hideBalance, setHideBalance] = useState(false);

  const showBalanceIconStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["4p"],
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  }));

  const navHeaderStackStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.neutralBaseHover,
    padding: theme.spacing["16p"],
    borderRadius: theme.radii.regular,
  }));

  const balanceCentStyle = useThemeStyles<ViewStyle>(theme => ({
    bottom: theme.spacing["4p"],
  }));

  const eyeIconStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-20"],
    padding: theme.spacing["8p"],
    borderRadius: theme.radii.xxlarge,
  }));

  return (
    <Stack direction="horizontal" style={navHeaderStackStyle} align="center" justify="space-between">
      <Stack direction="vertical" gap="4p">
        <Typography.Text color="neutralBase-20" size="footnote">
          {t("Home.AccountDetails.Accounts.balance")}
        </Typography.Text>
        {balance ? (
          hideBalance ? (
            <Typography.Text color="neutralBase-60" weight="semiBold" size="xlarge">
              ********
            </Typography.Text>
          ) : (
            <Stack direction="horizontal" align="flex-end">
              <Typography.Text color="neutralBase-60" weight="semiBold" size="xlarge">
                {`${dollars}` ?? 0}
              </Typography.Text>
              <Stack direction="horizontal" gap="4p" style={balanceCentStyle}>
                <Typography.Text color="neutralBase-60" size="title3" weight="regular">
                  {`.${cents}` ?? ".00"}
                </Typography.Text>
                <Typography.Text color="neutralBase-60" size="title3" weight="regular">
                  {t("Home.AccountDetails.Accounts.SAR")}
                </Typography.Text>
              </Stack>
            </Stack>
          )
        ) : (
          <Pressable style={showBalanceIconStyle} onPress={handleOnRefreshBalancePress}>
            <ActivityIndicator color={appTheme.theme.palette["neutralBase+30"]} size="large" />
          </Pressable>
        )}
      </Stack>
      {balance ? (
        <Pressable
          onPress={() => {
            setHideBalance(value => !value);
          }}
          style={eyeIconStyle}>
          {hideBalance ? <EyeHideFilledIcon /> : <EyeShowFilledIcon />}
        </Pressable>
      ) : null}
    </Stack>
  );
}
