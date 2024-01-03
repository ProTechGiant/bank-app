import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View } from "react-native";

import { NotificationIcon, PersonIcon, UnreadNotificationIcon } from "@/assets/icons";
import NavHeader from "@/components/NavHeader";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

interface UserFirstName {
  firstName: string | undefined;
  isNotificationIconHighlighted: boolean;
  testID?: string;
}

export default function HeaderHomePage({ firstName, isNotificationIconHighlighted, testID }: UserFirstName) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase-60"]);

  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <NavHeader
      testID={testID}
      variant="black"
      backgroundColor={NavHeaderColor}
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
      title={`${t("Home.DashboardScreen.welcomeMessageLabel")} ${firstName ?? ""}`}
    />
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
