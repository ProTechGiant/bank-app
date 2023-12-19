import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { NotificationIcon, PersonIcon, UnreadNotificationIcon } from "@/assets/icons";
import NavHeader from "@/components/NavHeader";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { BackgroundIcon } from "../assets/icons";
import BalanceCard from "./BalanceCard";
import QuickActionsSection from "./QuickActionsSection";

interface UserFirstName {
  firstName: string | undefined;
  isNotificationIconHighlighted: boolean;
  balance: number | undefined;
  accountNumber: string | undefined;
  onBalanceRefresh: () => void;
  onQuickActionsRefresh: () => void;
  onQuickActionPress: (screen: string, stack: string) => void;
  onEditQuickActionPress: () => void;
  testID?: string;
}

export default function HeaderHomePage({
  firstName,
  isNotificationIconHighlighted,
  balance,
  accountNumber,
  onBalanceRefresh,
  onQuickActionsRefresh,
  onQuickActionPress,
  onEditQuickActionPress,
  testID,
}: UserFirstName) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);
  const backgroundIconStyle = useThemeStyles<ViewStyle>(theme => ({
    zIndex: -1,
    position: "absolute",
    right: 0,
    top: theme.spacing["48p"],
  }));

  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <>
      <NavHeader
        testID={testID}
        variant="angled"
        backgroundAngledColor={NavHeaderColor}
        backgroundIcon={<BackgroundIcon />}
        backgroundIconStyle={backgroundIconStyle}
        backButton={
          <Pressable
            testID={testID !== undefined ? `${testID}-PersonButton` : undefined}
            onPress={() => {
              navigation.navigate("Settings.SettingsStack");
            }}>
            <PersonIcon color={iconColor} />
          </Pressable>
        }
        end={
          <Pressable
            testID={testID !== undefined ? `${testID}-NotificationButton` : undefined}
            onPress={() => {
              navigation.navigate("Notifications.NotificationsStack");
            }}>
            <NotificationIcon color={iconColor} />
            {/* TODO : Hide notificationUnread icon when there is no notifications */}
            {!isNotificationIconHighlighted && (
              <View style={I18nManager.isRTL ? style.notificationUnreadArabic : style.notificationUnreadEnglish}>
                <UnreadNotificationIcon color={iconColor} />
              </View>
            )}
          </Pressable>
        }
        title={`${t("Home.DashboardScreen.welcomeMessageLabel")} ${firstName ?? ""}`}>
        <BalanceCard
          testID="Home.DashboardScreen:BalanceCard"
          balance={balance}
          accountNumber={accountNumber}
          onBalanceRefresh={onBalanceRefresh}
        />
      </NavHeader>
      <View style={style.quickActionStyle}>
        <QuickActionsSection
          testID="Home.DashboardScreen:QuickActionsSection"
          onRefresh={onQuickActionsRefresh}
          onQuickActionPress={onQuickActionPress}
          onEditPress={onEditQuickActionPress}
        />
      </View>
    </>
  );
}

const style = StyleSheet.create({
  notificationUnreadArabic: {
    left: 3,
    position: "absolute",
    top: 3,
  },
  notificationUnreadEnglish: {
    position: "absolute",
    right: 3,
    top: 3,
  },
  quickActionStyle: {
    top: -45,
    zIndex: 1000000,
  },
});
