import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { NotificationIcon, PersonIcon, UnreadNotificationIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

interface UserFirstName {
  firstName: string | undefined;
}

export default function HeaderHomePage({ firstName }: UserFirstName) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const profileSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingTop: theme.spacing["16p"],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  }));

  const circularIconContainer = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.spacing["48p"],
    backgroundColor: theme.palette["complimentBase-20"],
    padding: theme.spacing["8p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <View style={profileSectionStyle}>
      <Pressable
        onPress={() => {
          navigation.navigate("Settings.SettingsStack");
        }}
        style={circularIconContainer}>
        <PersonIcon color={iconColor} />
      </Pressable>
      <Typography.Text color="neutralBase-60" weight="bold" size="callout">
        {`${t("Home.DashboardScreen.welcomeMessageLabel")} ${firstName ?? ""}`}
      </Typography.Text>
      <Pressable
        onPress={() => {
          navigation.navigate("Notifications.NotificationsStack");
        }}
        style={circularIconContainer}>
        <NotificationIcon />
        {/* TODO : Hide notificationUnread icon when there is no notifications */}
        <View style={I18nManager.isRTL ? style.notificationUnreadArabic : style.notificationUnreadEnglish}>
          <UnreadNotificationIcon color={iconColor} />
        </View>
      </Pressable>
    </View>
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
});
