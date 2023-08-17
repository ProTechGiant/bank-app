import React, { useState } from "react";
import { Keyboard, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";

import ChatMessageInput from "./ChatMessageInput";
import ChatSendButton from "./ChatSendButton";

const ChatInputBox = () => {
  const [message, setMessage] = useState<string>("");

  const handleOnChangeText = (value: string) => {
    setMessage(value);
  };

  const handleOnSendPress = () => {
    Keyboard.dismiss();
    // TODO: send message with api here
    setMessage("");
  };

  const chatInputBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    paddingStart: theme.spacing["20p"],
    alignItems: "flex-end",
  }));

  return (
    <Stack direction="horizontal" style={chatInputBoxStyle}>
      <ChatMessageInput onChangeText={handleOnChangeText} value={message} />
      <ChatSendButton onPress={handleOnSendPress} />
    </Stack>
  );
};

export default ChatInputBox;
