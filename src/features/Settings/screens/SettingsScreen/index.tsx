import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

import { FriendsIcon, NotificationIcon, QuestionIcon, SupportAgentIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { TableListCard } from "@/components/TableList";
import useNavigation from "@/navigation/use-navigation";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnReferPress = () => {
    navigation.navigate("Referral.HubScreen");
  };

  const handleOnHelpAndSupportPress = () => {
    Alert.alert("Help and support is pressed"); //TODO
  };

  const handleOnNotificationsPress = () => {
    navigation.navigate("NotificationManagement.NotificationManagementStack");
  };

  const handleOnQuestionsPress = () => {
    navigation.navigate(
      "FrequentlyAskedQuestions.FrequentlyAskedQuestionsStack" //, {
      // screen: "FrequentlyAskedQuestions.LandingPage",
    );
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader />
      <ContentContainer>
        <Stack align="stretch" direction="vertical" gap="12p">
          <TableListCard
            onPress={handleOnReferPress}
            icon={<FriendsIcon />}
            label={t("Settings.SettingsScreen.rewards")}
          />
          <TableListCard
            onPress={handleOnHelpAndSupportPress}
            icon={<SupportAgentIcon />}
            label={t("Settings.SettingsScreen.helpAndSupport")}
          />
          <TableListCard
            onPress={handleOnNotificationsPress}
            icon={<NotificationIcon />}
            label={t("Settings.SettingsScreen.notifications")}
          />
          <TableListCard
            onPress={handleOnQuestionsPress}
            icon={<QuestionIcon />}
            label={t("Settings.SettingsScreen.FAQs")}
          />
        </Stack>
      </ContentContainer>
    </Page>
  );
}
