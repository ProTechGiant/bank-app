import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { FriendsIcon, NotificationIcon, QuestionIcon } from "@/assets/icons";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const cardContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      minHeight: 54,
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: theme.spacing["16p"],
      borderRadius: theme.radii.small,
      backgroundColor: theme.palette["neutralBase-50"],
      marginHorizontal: theme.spacing["20p"],
      marginTop: theme.spacing["20p"],
    }),
    []
  );
  const iconContainer = useThemeStyles<ViewStyle>(
    theme => ({
      marginRight: theme.spacing["8p"],
    }),
    []
  );

  const navigation = useNavigation();

  const handleOnReferPress = () => {
    navigation.navigate("Referral.HubScreen");
  };

  const handleOnFAQPress = () => {
    navigation.navigate("FrequentlyAskedQuestions.LandingPage");
  };

  const handleOnNotificationsPress = () => {
    navigation.navigate("NotificationManagement.HubScreen");
  };

  return (
    <Page>
      <NavHeader />
      <Pressable style={cardContainerStyle} onPress={handleOnReferPress}>
        <FriendsIcon style={iconContainer} />
        <Typography.Text color="primaryBase+30" size="callout" weight="regular">
          {t("Settings.SettingsScreen.rewards")}
        </Typography.Text>
      </Pressable>
      <Pressable style={cardContainerStyle} onPress={handleOnFAQPress}>
        <View style={iconContainer}>
          <QuestionIcon />
        </View>
        <Typography.Text color="neutralBase+30" size="callout" weight="regular">
          {t("Settings.SettingsScreen.FAQs")}
        </Typography.Text>
      </Pressable>
      <Pressable style={cardContainerStyle} onPress={handleOnNotificationsPress}>
        <View style={iconContainer}>
          <NotificationIcon />
        </View>
        <Typography.Text color="neutralBase+30" size="callout" weight="regular">
          {t("Settings.SettingsScreen.notifications")}
        </Typography.Text>
      </Pressable>
    </Page>
  );
}
