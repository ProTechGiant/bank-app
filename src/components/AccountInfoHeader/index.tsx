import { Dimensions, LayoutAnimation, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";

import Typography from "@/components/Typography";
import { mockAccountBalances, mockAccounts } from "@/mocks/accountData";
import { palette, spacing } from "@/theme/values";

import NotificationDropdown from "../NotificationDropdown";
import Animated from "react-native-reanimated";
import { useEffect } from "react";

export interface AccountInfoHeaderProps {
  size: "full" | "medium" | "small";
}
export default function AccountInfoHeader({ size }: AccountInfoHeaderProps) {
  let currencyType;
  let currentAccountBalance;
  let intergerBalance;
  let decimalBalance;

  const currentAccount =
    mockAccounts[0]?.Data?.Account?.find(acc => {
      return acc.AccountType === "CURRENT";
    }) ?? "";

  const curentAccountName = currentAccount && currentAccount?.Description ? currentAccount?.Description : "";

  const currentAccountIBAN =
    (currentAccount &&
      currentAccount?.Account?.filter(acc => {
        return acc.schemeName === "IBAN.NUMBER";
      })[0]?.identification) ??
    "";

  const currentAccountStatus =
    currentAccount && currentAccount?.AccountId
      ? mockAccountBalances[0]?.Data?.Balance?.find(acc => {
          return acc.AccountId === currentAccount.AccountId && acc.Type === "INTERIM_AVAILABLE";
        })
      : undefined;

  if (currentAccountStatus && currentAccountStatus.Amount) {
    currencyType =
      currentAccountStatus && currentAccountStatus?.Amount?.Currency ? currentAccountStatus?.Amount?.Currency : "";

    [intergerBalance, decimalBalance] = currentAccountStatus?.Amount?.Amount?.split(".");
    currentAccountBalance =
      currentAccountStatus?.Amount?.Amount?.length && intergerBalance
        ? Intl.NumberFormat("en-US", {}).format(Number(intergerBalance))
        : "";
  }

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [size]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.headerWrapper}>
        <View style={styles.header}>
          <Typography.Text color="neutralBase-50" weight="medium" size="callout">
            {curentAccountName.toUpperCase()}
          </Typography.Text>
        </View>
        {size === "full" && <Typography.Text color="neutralBase-50">{currentAccountIBAN}</Typography.Text>}
        {size === "small" && decimalBalance && currencyType && currentAccountBalance && (
          <View style={styles.row}>
            <Typography.Text color="neutralBase-50">{currentAccountBalance}</Typography.Text>
            <Typography.Text color="neutralBase-50" opacity="semiTransparent">
              .{decimalBalance} {currencyType}
            </Typography.Text>
          </View>
        )}
        {decimalBalance && currencyType && currentAccountBalance && size !== "small" && (
          <View style={styles.accountBalanceWrapper}>
            <View style={{ maxWidth: Dimensions.get("window").width - spacing.medium * 2 - 30 }}>
              <Typography.Header size="large" color="neutralBase-50" adjustsFontSizeToFit={true} numberOfLines={1}>
                {currentAccountBalance}
              </Typography.Header>
            </View>
            <View style={{ paddingBottom: 2 }}>
              <Typography.Text color="neutralBase-50" opacity="semiTransparent">
                .{decimalBalance} {currencyType}
              </Typography.Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.notificationsWrapper}>
        <NotificationDropdown />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  accountBalanceWrapper: {
    alignItems: "flex-end",
    flexDirection: "row",
    paddingTop: spacing.xlarge,
  },
  container: {
    backgroundColor: palette.primaryBase,
    paddingTop: spacing.medium,
  },
  header: {
    alignItems: "center",
    backgroundColor: palette.primaryBase,
    marginTop: spacing.xlarge,
  },
  headerWrapper: {
    alignItems: "center",
    paddingTop: spacing.small,
    paddingBottom: spacing.large,
  },
  notificationsWrapper: {
    paddingHorizontal: spacing.medium,
    paddingBottom: spacing.medium,
  },
  row: {
    alignItems: "flex-end",
    flexDirection: "row",
  },
});
