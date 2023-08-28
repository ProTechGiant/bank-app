import React, { useState } from "react";
import { Keyboard, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

import { useSendMessage } from "../hooks/use-send-message";
import ChatMessageInput from "./ChatMessageInput";
import ChatSendButton from "./ChatSendButton";

export default function ChatInputBox() {
  const submitMessage = useSendMessage();
  const [message, setMessage] = useState<string>("");

  const handleOnChangeText = (value: string) => {
    setMessage(value);
  };

  const handleOnSendPress = async () => {
    Keyboard.dismiss();
    const requestBody = {
      Message: message,
      TranscriptPositionIncluding: "1", //ToDO: when linking with get chat api
    };

    try {
      await submitMessage.mutateAsync(requestBody);
      setMessage("");
    } catch (error) {
      warn("Live Chat", `Could not send a Message: ${(error as Error).message}`);
    }
  };

  const chatInputBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    paddingStart: theme.spacing["20p"],
    alignItems: "flex-end",
  }));

  return (
    <Stack direction="horizontal" style={chatInputBoxStyle}>
      <ChatMessageInput onChangeText={handleOnChangeText} value={message} />
      <ChatSendButton onPress={handleOnSendPress} disabled={message.trim().length < 1} />
    </Stack>
  );
}
