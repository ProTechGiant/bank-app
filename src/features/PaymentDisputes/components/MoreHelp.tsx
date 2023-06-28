import { StyleSheet, View } from "react-native";

import CallBankFeedbackButton from "@/components/FeedbackButton/CallBankFeedbackButton";
import LiveChatFeedbackButton from "@/components/FeedbackButton/LiveChatFeedbackButton";
import Stack from "@/components/Stack";
import { PhoneBook } from "@/hooks/use-call-support";

interface MoreHelpProps {
  phoneNumber: PhoneBook;
}

export default function MoreHelp({ phoneNumber }: MoreHelpProps) {
  return (
    <Stack direction="horizontal" gap="12p" align="stretch">
      <View style={styles.flexContainer}>
        <CallBankFeedbackButton phoneNumber={phoneNumber} />
      </View>
      <View style={styles.flexContainer}>
        <LiveChatFeedbackButton />
      </View>
    </Stack>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flexGrow: 1,
  },
});
