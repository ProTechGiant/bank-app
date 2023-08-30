import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";
import { useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

interface fetchBankNumber {
  PhoneNumber: string;
}

const queryKeys = {
  all: () => ["callTheBank"] as const,
};

export default function useCallBank() {
  const { t } = useTranslation();

  const tryCallBank = async () => {
    const phoneNumber = getBankNumber.data?.PhoneNumber;

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

  const getBankNumber = useQuery(queryKeys.all(), () => {
    return api<fetchBankNumber>("v1", "genesys/call-the-bank", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });

  return { tryCallBank, getBankNumber };
}
