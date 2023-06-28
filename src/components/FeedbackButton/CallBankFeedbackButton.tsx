import { useTranslation } from "react-i18next";

import { PhoneIcon } from "@/assets/icons";
import useCallSupport, { PhoneBook } from "@/hooks/use-call-support";

import FeedbackButton from "./FeedbackButton";

interface CallBankFeedbackButtonProps {
  phoneNumber: PhoneBook;
}

export default function CallBankFeedbackButton({ phoneNumber }: CallBankFeedbackButtonProps) {
  const { t } = useTranslation();
  const { tryCall } = useCallSupport();

  return (
    <FeedbackButton
      onPress={() => tryCall(phoneNumber)}
      text={t("HelpAndSupport.HubScreen.callUs")}
      icon={<PhoneIcon />}
    />
  );
}
