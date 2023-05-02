import { useTranslation } from "react-i18next";

import { ChatIcon } from "@/assets/icons";
import useNavigation from "@/navigation/use-navigation";

import FeedbackButton from "./FeedbackButton";

export default function LiveChatFeedbackButton() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnPress = () => {
    navigation.navigate("HelpAndSupport.HelpAndSupportStack", { screen: "HelpAndSupport.LiveChatScreen" });
  };

  return <FeedbackButton onPress={handleOnPress} text={t("HelpAndSupport.HubScreen.liveChat")} icon={<ChatIcon />} />;
}
