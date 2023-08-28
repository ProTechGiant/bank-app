import { useRef, useState } from "react";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";

import AgentAwaitingMessage from "./AgentAwaitingMessage";
import AgentInformation from "./AgentInformation";
import BubbleMessage from "./BubbleMessage";
import ChatScrollToEndButton from "./ChatScrollToEndButton";
import ChatTypingIndicator from "./ChatTypingIndicator";
import SupportAgentTimer from "./SupportAgentTimer";

// TODO: remove messages mock data
const messages = [
  { type: "welcome", content: "Welcome to the chat!" },
  { type: "user", content: "Hello, how can I help you?" },
  { type: "agent", content: "Agent has joined the chat." },
  { type: "welcome", content: "Welcome to the chat!" },
  { type: "user", content: "Hello, how can I help you?" },
  { type: "agent", content: "Agent has joined the chat." },
  { type: "welcome", content: "Welcome to the chat!" },
  // { type: "user", content: "Hello, how can I help you?" },
  // { type: "agent", content: "Agent has joined the chat." },
  // { type: "welcome", content: "Welcome to the chat!" },
  // { type: "user", content: "Hello, how can I help you?" },
  // { type: "user", content: "Hello, how can I help you?" },
  // { type: "user", content: "Agent has joined the chat." },
  // { type: "agent", content: "Agent has joined the chat." },
  // { type: "user", content: "Agent has joined the chat." },
  // { type: "agent", content: "Agent has joined the chat." },
  // { type: "agent", content: "Agent has joined the chat." },
  // { type: "agent", content: "Agent has joined the chat." },
  // { type: "agent", content: "Agent has joined the chat." },
];

export default function ChatList() {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollListToEnd = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const distanceFromBottom = contentHeight - scrollOffset - scrollViewHeight;
    const showButtonThreshold = 100;
    setShowScrollButton(distanceFromBottom > showButtonThreshold);
  };

  const flatListRef = useRef<FlatList<unknown> | null>(null); // TODO: add message type

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
  }));

  return (
    <Stack direction="vertical" align="stretch" style={styles.containerStyle}>
      {/* TODO: will change to dynamic name and dynamic status when the api ready  */}
      <AgentInformation isOnline={true} agentName="Jane Baker" />
      <AgentAwaitingMessage />
      <FlatList
        ref={flatListRef}
        data={messages}
        // TODO: add item type and change BubbleMessage props interface
        renderItem={({ item }) => <BubbleMessage message={item.content} isAgent={item.type === "agent"} time="22:22" />}
        contentContainerStyle={contentContainerStyle}
        ListFooterComponent={<SupportAgentTimer timeInSeconds={230} />} // TODO: get time value from api
        keyExtractor={(item, index) => index.toString()} // TODO: use message id instead
        onContentSizeChange={scrollListToEnd}
        onLayout={scrollListToEnd}
        onScroll={handleScroll}
      />
      <ChatTypingIndicator />
      {showScrollButton ? <ChatScrollToEndButton onPress={scrollListToEnd} /> : null}
    </Stack>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexBasis: 0,
    flexGrow: 1,
  },
});
