import { useTranslation } from "react-i18next";

import { ChatIcon } from "@/assets/icons";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import FeedbackButton from "./FeedbackButton";

export default function LiveChatFeedbackButton() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnPress = () => {
    navigation.navigate("HelpAndSupport.HelpAndSupportStack", { screen: "HelpAndSupport.LiveChatScreen" });
  };

  const chatIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <FeedbackButton
      onPress={handleOnPress}
      text={t("HelpAndSupport.HubScreen.liveChat")}
      icon={<ChatIcon color={chatIconColor} />}
    />
  );
}
