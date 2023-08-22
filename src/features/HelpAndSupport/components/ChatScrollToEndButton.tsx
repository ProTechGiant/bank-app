import { Pressable, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import { ChatScrollToEndIcon } from "../assets/icons";

interface ChatScrollToEndButtonProps {
  onPress: () => void;
}

export default function ChatScrollToEndButton({ onPress }: ChatScrollToEndButtonProps) {
  const scrollToEndButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-30"],
    height: 36,
    width: 36,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: theme.spacing["12p"],
    right: theme.spacing["16p"],
  }));

  return (
    <Pressable onPress={onPress} style={scrollToEndButtonStyle}>
      <ChatScrollToEndIcon />
    </Pressable>
  );
}
