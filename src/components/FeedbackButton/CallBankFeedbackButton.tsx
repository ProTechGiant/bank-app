import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";

import { PhoneIcon } from "@/assets/icons";

import FeedbackButton from "./FeedbackButton";

interface CallBankFeedbackButtonProps {
  phoneNumber: string;
}

export default function CallBankFeedbackButton({ phoneNumber }: CallBankFeedbackButtonProps) {
  const { t } = useTranslation();

  const handleOnPress = () => {
    Alert.alert(phoneNumber, undefined, [
      {
        text: t("HelpAndSupport.HubScreen.cancel"),
      },
      {
        text: t("HelpAndSupport.HubScreen.call"),
        onPress: async () => {
          try {
            const canMakeTheCall = await Linking.canOpenURL(`tel:${phoneNumber}`);
            if (canMakeTheCall) {
              Linking.openURL(`tel:${phoneNumber}`);
            } else {
              Clipboard.setString(phoneNumber);
              Alert.alert(t("HelpAndSupport.HubScreen.callError"));
            }
          } catch (error) {
            Clipboard.setString(phoneNumber);
            Alert.alert(t("HelpAndSupport.HubScreen.callError"));
          }
        },
      },
    ]);
  };

  return <FeedbackButton onPress={handleOnPress} text={t("HelpAndSupport.HubScreen.callUs")} icon={<PhoneIcon />} />;
}
