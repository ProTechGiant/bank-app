import Clipboard from "@react-native-clipboard/clipboard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutAnimation, Pressable, SafeAreaView, useWindowDimensions, View, ViewStyle } from "react-native";

import { AccountIcon, HideIcon, ShowIcon } from "@/assets/icons";
import BulletinBoard from "@/components/BulletinBoard";
import DismissibleBanner from "@/components/DismissibleBanner";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useThemeStyles } from "@/theme";
import { pluralize } from "@/utils";

import TemporaryPillButton from "./TemporaryPillButton";
import useFetchAccount from "./use-fetch-account";
import usePendingNotications from "./use-pending-notications";

export interface AccountInfoHeaderProps {
  size: "full" | "medium" | "small";
}

export default function AccountInfoHeader({ size }: AccountInfoHeaderProps) {
  const { width } = useWindowDimensions();
  const accountBalanceStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "flex-end",
      flexDirection: "row",
      paddingTop: theme.spacing["24p"],
    }),
    []
  );
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["primaryBase"],
      paddingTop: theme.spacing["16p"],
    }),
    []
  );

  const headerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      marginTop: theme.spacing["24p"],
    }),
    []
  );

  const smallHeaderStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingTop: theme.spacing["24p"],
    }),
    []
  );

  const headerWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      paddingTop: theme.spacing["8p"],
      paddingBottom: theme.spacing["24p"],
    }),
    []
  );
  const notificationsStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing["16p"],
      paddingBottom: theme.spacing["32p"],
    }),
    []
  );
  const currentAccountBalanceStyle = useThemeStyles<ViewStyle>(
    theme => ({
      maxWidth: width - theme.spacing["16p"] * 2 - 30,
    }),
    [width]
  );

  const buttonContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing["32p"],
      paddingTop: theme.spacing["16p"],
    }),
    []
  );

  const accountBalanceRowStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "flex-end",
      flexDirection: "row",
      marginBottom: theme.spacing["16p"],
    }),
    []
  );

  const { t } = useTranslation();
  const { data } = useFetchAccount();
  const [showToast, setShowToast] = useState(false);
  const { showAccountBalance, setShowAccountBalance } = useGlobalContext();

  const handleOnCopyCodePress = () => {
    Clipboard.setString(data.currentAccountIBAN);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const pendingNotifications = usePendingNotications();

  const bulletinTitle = pluralize(pendingNotifications?.length, "notification", "s");

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [size]);

  const handleOnPressBalanceVisibility = () => {
    setShowAccountBalance(!showAccountBalance);
  };

  return (
    <SafeAreaView style={[container, headerWrapperStyle]}>
      <DismissibleBanner visible={showToast} message={t("Home.DashboardScreen.AccountInfoHeader.IBANCopied") ?? ""} />
      <View style={[headerStyle, size !== "full" && smallHeaderStyle]}>
        <Typography.Text color="neutralBase-50" weight="medium" size="callout">
          {data.currentAccountName?.toUpperCase()}
        </Typography.Text>
      </View>
      {size === "full" && (
        <Pressable onPress={handleOnCopyCodePress}>
          <Typography.Text color="neutralBase-50">{data.currentAccountIBAN}</Typography.Text>
        </Pressable>
      )}
      {size === "small" &&
        data.decimalBalance &&
        data.currencyType &&
        data.currentAccountBalance &&
        (showAccountBalance ? (
          <View style={accountBalanceRowStyle}>
            <Typography.Text color="neutralBase-50">{data.currentAccountBalance}</Typography.Text>
            <Typography.Text color="neutralBase-50-50%">
              .{data.decimalBalance} {data.currencyType}
            </Typography.Text>
          </View>
        ) : (
          <View style={{ paddingBottom: 16 }}>
            <Typography.Text color="neutralBase-50-50%" size="footnote">
              {t("Home.DashboardScreen.AccountInfoHeader.balanceHidden")}
            </Typography.Text>
          </View>
        ))}
      {data.decimalBalance &&
        data.currencyType &&
        data.currentAccountBalance &&
        size !== "small" &&
        (showAccountBalance ? (
          <View style={accountBalanceStyle}>
            <View style={currentAccountBalanceStyle}>
              <Typography.Header size="large" color="neutralBase-50" adjustsFontSizeToFit={true} numberOfLines={1}>
                {data.currentAccountBalance}
              </Typography.Header>
            </View>
            <View style={{ paddingBottom: 4 }}>
              <Typography.Text color="neutralBase-50-50%">
                .{data.decimalBalance} {data.currencyType}
              </Typography.Text>
            </View>
          </View>
        ) : (
          <View style={accountBalanceStyle}>
            <Typography.Text color="neutralBase-50-50%" size="footnote">
              {t("Home.DashboardScreen.AccountInfoHeader.balanceHidden")}
            </Typography.Text>
          </View>
        ))}
      {size !== "small" && (
        <Stack direction="horizontal" gap="8p" style={buttonContainerStyle}>
          <TemporaryPillButton
            onPress={handleOnPressBalanceVisibility}
            iconLeft={showAccountBalance ? <ShowIcon /> : <HideIcon />}>
            {showAccountBalance
              ? t("Home.DashboardScreen.AccountInfoHeader.hideBalance")
              : t("Home.DashboardScreen.AccountInfoHeader.showBalance")}
          </TemporaryPillButton>
          <TemporaryPillButton iconLeft={<AccountIcon />}>
            {t("Home.DashboardScreen.AccountInfoHeader.myAccount")}
          </TemporaryPillButton>
        </Stack>
      )}
      <View style={notificationsStyle}>
        <BulletinBoard data={pendingNotifications} title={bulletinTitle} />
      </View>
    </SafeAreaView>
  );
}
