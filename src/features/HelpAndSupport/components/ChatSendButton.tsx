import { I18nManager, Pressable, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import { ChatSendIcon } from "../assets/icons";

interface ChatSendButtonProps {
  onPress: () => void;
}

const ChatSendButton = ({ onPress }: ChatSendButtonProps) => {
  const sendButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  }));

  return (
    <Pressable onPress={onPress} style={sendButtonStyle}>
      <ChatSendIcon />
    </Pressable>
  );
};

export default ChatSendButton;
