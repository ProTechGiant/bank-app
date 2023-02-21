import Clipboard from "@react-native-clipboard/clipboard";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, SafeAreaView, View, ViewStyle } from "react-native";
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";

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
  lastContentOffset: SharedValue<number>;
}

export default function AccountInfoHeader({ lastContentOffset }: AccountInfoHeaderProps) {
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

  const handleOnPressBalanceVisibility = () => {
    setShowAccountBalance(!showAccountBalance);
  };

  const IBANAnimatedStyle = useAnimatedStyle(() => {
    const opacity = 2 - lastContentOffset.value / 10;
    return {
      opacity,
      height: interpolate(lastContentOffset.value, [200, 250], [40, 0], "clamp"),
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const opacity = 5.4 - lastContentOffset.value / 10;
    return {
      opacity,
      height: interpolate(lastContentOffset.value, [100, 200], [50, 0], "clamp"),
    };
  });

  const textCurrentAccountAnimatedStyle = useAnimatedStyle(() => {
    return {
      fontSize: interpolate(lastContentOffset.value, [0.001, 100], [34, 20], "clamp"),
      color: "#FFFFFF",
      paddingTop: interpolate(lastContentOffset.value, [0.001, 100], [24, 0], "clamp"),
    };
  });

  const textHiddenAnimatedStyle = useAnimatedStyle(() => {
    return {
      paddingTop: interpolate(lastContentOffset.value, [0.001, 100], [24, 0], "clamp"),
      fontSize: 17,
      color: "#FFFFFF7F",
    };
  });

  const container = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["primaryBase"],
    paddingTop: theme.spacing["16p"],
    alignItems: "center",
    paddingBottom: theme.spacing["24p"],
  }));

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginTop: theme.spacing["24p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["16p"],
  }));

  const notificationsStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
  }));

  return (
    <View style={container}>
      <DismissibleBanner visible={showToast} message={t("Home.DashboardScreen.AccountInfoHeader.IBANCopied") ?? ""} />
      <Animated.View style={headerStyle}>
        <Typography.Text color="neutralBase-50" weight="medium" size="callout">
          {data.currentAccountName?.toUpperCase()}
        </Typography.Text>
      </Animated.View>
      <Animated.View style={IBANAnimatedStyle}>
        <Pressable onPress={handleOnCopyCodePress}>
          <Typography.Text color="neutralBase-50">{data.currentAccountIBAN}</Typography.Text>
        </Pressable>
      </Animated.View>
      {data.decimalBalance &&
        data.currencyType &&
        data.currentAccountBalance &&
        (showAccountBalance ? (
          <View style={{ alignItems: "baseline", flexDirection: "row" }}>
            <Animated.Text style={textCurrentAccountAnimatedStyle}>
              {data.currentAccountBalance}.{data.decimalBalance}
            </Animated.Text>
            <Typography.Text color="neutralBase-50-50%">{" " + data.currencyType}</Typography.Text>
          </View>
        ) : (
          <Animated.Text style={textHiddenAnimatedStyle}>
            {t("Home.DashboardScreen.AccountInfoHeader.balanceHidden")}
          </Animated.Text>
        ))}
      <Animated.View style={buttonAnimatedStyle}>
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
      </Animated.View>
      <SafeAreaView>
        <View style={notificationsStyle}>
          <BulletinBoard data={pendingNotifications} title={bulletinTitle} />
        </View>
      </SafeAreaView>
    </View>
  );
}
