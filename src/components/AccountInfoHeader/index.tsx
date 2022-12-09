import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";

import Typography from "@/components/Typography";
import { mockAccountBalances, mockAccounts } from "@/mocks/accountData";
import { palette, spacing } from "@/theme/values";

import NotificationDropdown from "../NotificationDropdown";

export default function AccountInfoHeader() {
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

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.headerWrapper}>
        <Typography.Text color="neutralBase-50" weight="medium" size="callout">
          {curentAccountName.toUpperCase()}
        </Typography.Text>
        <Typography.Text color="neutralBase-50">{currentAccountIBAN}</Typography.Text>
        {decimalBalance && currencyType && currentAccountBalance && (
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
      <NotificationDropdown />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  accountBalanceWrapper: {
    alignItems: "flex-end",
    flexDirection: "row",
    paddingVertical: spacing.xlarge,
  },
  container: {
    backgroundColor: palette.primaryBase,
    marginBottom: spacing.medium,
  },
  headerWrapper: {
    alignItems: "center",
    paddingBottom: spacing.medium,
    paddingTop: spacing.small,
  },
});
