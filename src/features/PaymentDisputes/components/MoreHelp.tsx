import { StyleSheet, View } from "react-native";

import CallBankFeedbackButton from "@/components/FeedbackButton/CallBankFeedbackButton";
import LiveChatFeedbackButton from "@/components/FeedbackButton/LiveChatFeedbackButton";
import Stack from "@/components/Stack";

interface MoreHelpProps {
  phoneNumber: string;
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
