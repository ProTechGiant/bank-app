import React from "react";
import { I18nManager, Pressable, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import { ChatSendIcon } from "../assets/icons";

interface ChatSendButtonProps {
  onPress: () => void;
  disabled: boolean;
}

export default function ChatSendButton({ onPress, disabled }: ChatSendButtonProps) {
  const sendButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  }));

  const disabledIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);
  const enabledIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <Pressable onPress={onPress} style={sendButtonStyle} disabled={disabled}>
      <ChatSendIcon color={disabled ? disabledIconColor : enabledIconColor} />
    </Pressable>
  );
}
