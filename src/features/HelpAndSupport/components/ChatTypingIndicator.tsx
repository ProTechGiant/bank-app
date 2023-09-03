import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import TypingIndicator from "./TypingIndicator";

interface ChatTypingIndicatorProps {
  agentName: string;
}

const ChatTypingIndicator = ({ agentName }: ChatTypingIndicatorProps) => {
  const { t } = useTranslation();

  const chatTypingIndicatorStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingStart: theme.spacing["4p"],
    marginVertical: theme.spacing["8p"],
  }));

  return (
    <Stack direction="horizontal" align="center" gap="8p" style={chatTypingIndicatorStyle}>
      <TypingIndicator />
      <Typography.Text weight="regular" size="caption1" color="neutralBase+20">
        {t("HelpAndSupport.ChatScreen.chatTypingIndicator", { agentName })}
      </Typography.Text>
    </Stack>
  );
};

export default ChatTypingIndicator;
