import { Dimensions, LayoutAnimation, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";

import Typography from "@/components/Typography";
import { palette, spacing } from "@/theme/values";
import { useEffect } from "react";

import NotificationDropdown from "../NotificationDropdown";
import { useFetchAccount } from "./use-fetch-account";
export interface AccountInfoHeaderProps {
  size: "full" | "medium" | "small";
}

export default function AccountInfoHeader({ size }: AccountInfoHeaderProps) {
  const { data } = useFetchAccount();

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [size]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.headerWrapper}>
        <View style={styles.header}>
          <Typography.Text color="neutralBase-50" weight="medium" size="callout">
            {data.currentAccountName?.toUpperCase()}
          </Typography.Text>
        </View>
        {size === "full" && <Typography.Text color="neutralBase-50">{data.currentAccountIBAN}</Typography.Text>}
        {size === "small" && data.decimalBalance && data.currencyType && data.currentAccountBalance && (
          <View style={styles.row}>
            <Typography.Text color="neutralBase-50">{data.currentAccountBalance}</Typography.Text>
            <Typography.Text color="neutralBase-50" opacity="semiTransparent">
              .{data.decimalBalance} {data.currencyType}
            </Typography.Text>
          </View>
        )}
        {data.decimalBalance && data.currencyType && data.currentAccountBalance && size !== "small" && (
          <View style={styles.accountBalanceWrapper}>
            <View style={{ maxWidth: Dimensions.get("window").width - spacing.medium * 2 - 30 }}>
              <Typography.Header size="large" color="neutralBase-50" adjustsFontSizeToFit={true} numberOfLines={1}>
                {data.currentAccountBalance}
              </Typography.Header>
            </View>
            <View style={{ paddingBottom: 2 }}>
              <Typography.Text color="neutralBase-50" opacity="semiTransparent">
                .{data.decimalBalance} {data.currencyType}
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
