import React, { memo, useState } from "react";
import { Keyboard, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

import { useSendMessage } from "../hooks/use-send-message";
import { ChatEvent } from "../types";
import ChatMessageInput from "./ChatMessageInput";
import ChatSendButton from "./ChatSendButton";

interface ChatInputBoxProps {
  onSendSuccess: (ChatPendingMessage?: ChatEvent) => void;
  connectionStatus: boolean | null;
}

function ChatInputBox({ onSendSuccess, connectionStatus }: ChatInputBoxProps) {
  const submitMessage = useSendMessage();
  const [message, setMessage] = useState<string>("");

  const handleOnChangeText = (value: string) => {
    setMessage(value);
  };

  const handleOnSendPress = async () => {
    Keyboard.dismiss();
    const requestBody = {
      Message: message,
      TranscriptPositionIncluding: "0",
    };

    if (connectionStatus === false) {
      // this is pending message, it's values will be ignored except " Text: message" once connection restored
      // we added them here to not break ChatEvent typescript interface
      // we can only send message text with the api
      onSendSuccess({
        Index: Date.now(),
        Type: "Message",
        MessageType: "pending",
        Text: message,
        UtcTime: Number(new Date()),
        From: {
          Type: "Client",
          Nickname: "you",
          ParticipantId: 1,
        },
      });
      setMessage("");
      return;
    }

    try {
      await submitMessage.mutateAsync(requestBody);
      setMessage("");
      onSendSuccess();
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

export default memo(ChatInputBox);
