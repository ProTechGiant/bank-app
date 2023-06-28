import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";

import { mockHelpAndSupport } from "@/mocks/helpAndSupportData";

export default function useCallSupport() {
  const { t } = useTranslation();

  const tryCall = async (contentTag: PhoneBook) => {
    const phoneNumber = lookup(contentTag);

    if (phoneNumber === undefined) {
      return Alert.alert(t("CallSupportHelper.failed"));
    }

    try {
      const canOpenUrl = await Linking.canOpenURL(`tel:${phoneNumber}`);

      if (canOpenUrl === false) {
        throw new Error("Cannot open phone number");
      }

      await Linking.openURL(`tel:${phoneNumber}`);
    } catch (error) {
      Clipboard.setString(phoneNumber);
      Alert.alert(t("CallSupportHelper.copied"));
    }
  };

  const lookup = (contentTag: PhoneBook) => {
    const faqItem = mockHelpAndSupport.ChildrenContents?.find(item => item.ContentTag === contentTag);
    const phoneNumber = faqItem?.ContentDescription;

    return phoneNumber;
  };

  return { tryCall, lookup };
}

export enum PhoneBook {
  "CALL_US" = "CallUS",
  "REPORT_FRAUD" = "ReportFraud",
}
