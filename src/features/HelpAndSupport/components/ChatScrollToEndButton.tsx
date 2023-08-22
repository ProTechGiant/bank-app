import { Pressable, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import { ChatScrollToEndIcon } from "../assets/icons";

interface ChatScrollToEndButtonProps {
  onPress: () => void;
}

const ChatScrollToEndButton = ({ onPress }: ChatScrollToEndButtonProps) => {
  const scrollToEndButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-30"],
    height: 36,
    width: 36,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  }));

  return (
    <Pressable onPress={onPress} style={scrollToEndButtonStyle}>
      <ChatScrollToEndIcon />
    </Pressable>
  );
};

export default ChatScrollToEndButton;
