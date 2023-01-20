import Clipboard from "@react-native-clipboard/clipboard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, LayoutAnimation, Pressable, SafeAreaView, StyleSheet, View, ViewStyle } from "react-native";

import Toast from "@/components/Toast";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import NotificationDropdown from "../NotificationDropdown";
import { useFetchAccount } from "./use-fetch-account";

export interface AccountInfoHeaderProps {
  size: "full" | "medium" | "small";
}

export default function AccountInfoHeader({ size }: AccountInfoHeaderProps) {
  const accountBalanceStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "flex-end",
      flexDirection: "row",
      paddingTop: theme.spacing.xlarge,
    }),
    []
  );
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["primaryBase"],
      paddingTop: theme.spacing.medium,
    }),
    []
  );

  const headerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      marginTop: theme.spacing.xlarge,
    }),
    []
  );
  const headerWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      paddingTop: theme.spacing.small,
      paddingBottom: theme.spacing.large,
    }),
    []
  );
  const notificationsStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing.medium,
      paddingBottom: theme.spacing.medium,
    }),
    []
  );
  const currentAccountBalanceStyle = useThemeStyles<ViewStyle>(
    theme => ({
      maxWidth: Dimensions.get("window").width - theme.spacing.medium * 2 - 30,
    }),
    []
  );

  const { t } = useTranslation();
  const { data } = useFetchAccount();
  const [showToast, setShowToast] = useState(false);

  const handleOnCopyCodePress = () => {
    Clipboard.setString(data.currentAccountIBAN);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [size]);

  return (
    <SafeAreaView style={[container, headerWrapperStyle]}>
      <Toast showToast={showToast} message={t("Home.DashboardScreen.AccountInfoHeader.IBANCopied") ?? ""} />
      <View style={headerStyle}>
        <Typography.Text color="neutralBase-50" weight="medium" size="callout">
          {data.currentAccountName?.toUpperCase()}
        </Typography.Text>
      </View>
      {size === "full" && (
        <Pressable onPress={handleOnCopyCodePress}>
          <Typography.Text color="neutralBase-50">{data.currentAccountIBAN}</Typography.Text>
        </Pressable>
      )}
      {size === "small" && data.decimalBalance && data.currencyType && data.currentAccountBalance && (
        <View style={styles.row}>
          <Typography.Text color="neutralBase-50">{data.currentAccountBalance}</Typography.Text>
          <Typography.Text color="neutralBase-50-50%">
            .{data.decimalBalance} {data.currencyType}
          </Typography.Text>
        </View>
      )}
      {data.decimalBalance && data.currencyType && data.currentAccountBalance && size !== "small" && (
        <View style={accountBalanceStyle}>
          <View style={currentAccountBalanceStyle}>
            <Typography.Header size="large" color="neutralBase-50" adjustsFontSizeToFit={true} numberOfLines={1}>
              {data.currentAccountBalance}
            </Typography.Header>
          </View>
          <View style={{ paddingBottom: 2 }}>
            <Typography.Text color="neutralBase-50-50%">
              .{data.decimalBalance} {data.currencyType}
            </Typography.Text>
          </View>
        </View>
      )}
      <View style={notificationsStyle}>
        <NotificationDropdown />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "flex-end",
    flexDirection: "row",
  },
});
