import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

// import { useChatRefresh } from "../hooks/query-hooks";
import { useSendMessage } from "../hooks/use-send-message";
import { AwaitTimeData, ChatEvent, ChatResponse } from "../types";
import { formatUtcTimestampToTime } from "../utils";
import AgentAwaitingMessage from "./AgentAwaitingMessage";
import AgentInformation from "./AgentInformation";
import BubbleMessage from "./BubbleMessage";
import ChatInputBox from "./ChatInputBox";
import ChatScrollToEndButton from "./ChatScrollToEndButton";
// import ChatTypingIndicator from "./ChatTypingIndicator";
import DismissKeyboardWrapper from "./DismissKeyboardWrapper";
import SupportAgentTimer from "./SupportAgentTimer";

interface ChatListProps {
  onChatSessionEnd: () => void;
  initialChatData: ChatResponse;
  agentWaitingTime: AwaitTimeData;
  enquiryType: string;
  subEnquiryType: string;
}
// TODO: onChatSessionEnd for integrate refresh and fetch chat history api
function ChatList({ initialChatData, agentWaitingTime, enquiryType, subEnquiryType }: ChatListProps) {
  const { t } = useTranslation();
  // const { mutateAsync: refreshChatData } = useChatRefresh(); // TODO: for integrate refresh and fetch chat history api
  const { mutateAsync: sendMessage } = useSendMessage();
  const [chatData, setChatData] = useState<ChatResponse>(initialChatData);
  const [showScrollButton, setShowScrollButton] = useState(false);
  // const [showAgentTyping, setShowAgentTyping] = useState(false); // TODO: for integrate refresh and fetch chat history api
  // const [showWaitingTimer, setShowWaitingTimer] = useState(true); // TODO: for integrate refresh and fetch chat history api

  const flatListRef = useRef<FlatList<ChatEvent> | null>(null);

  useEffect(() => {
    sendAutoGeneratedMessage();
  }, []);

  const sendAutoGeneratedMessage = async () => {
    try {
      const response = await sendMessage({
        Message: t("HelpAndSupport.ChatScreen.chatAutoGeneratedMessage", {
          subEnquiryType,
          enquiryType,
        }),
        TranscriptPositionIncluding: "1",
      });
      setChatData({ ...response, Messages: [...response.Messages.reverse()] });
    } catch (error) {
      warn("Error refreshing chat:", JSON.stringify(error));
    }
  };

  const scrollListToEnd = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: 0,
        animated: true,
        viewPosition: 1,
        viewOffset: 0,
      });
    }
  };

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset } = event.nativeEvent;
      if (contentOffset.y > 100 !== showScrollButton) {
        setShowScrollButton(contentOffset.y > 100);
      }
    },
    [showScrollButton]
  );

  // TODO: we may change the logic inside renderItem when integrate refresh and fetch chat history api
  const renderItem = useCallback(({ item }: { item: ChatEvent; index: number }) => {
    if (item.From.Type === "Client" && item.Type === "ParticipantJoined" && item.Index === 1) {
      return <AgentAwaitingMessage />;
    }
    if (item.Type === "Message" && item.From.Type !== "External") {
      // TODO: change BubbleMessage props interface
      return (
        <BubbleMessage
          message={item.Text}
          isAgent={item.From.Type === "Agent"}
          time={formatUtcTimestampToTime(item.UtcTime)}
        />
      );
    }
    return null;
  }, []);

  const keyExtractor = useCallback((item: ChatEvent) => item.Index.toString(), []);

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    flexGrow: 1,
    justifyContent: "flex-end",
  }));

  return (
    <>
      <Stack direction="vertical" align="stretch" style={styles.containerStyle}>
        <DismissKeyboardWrapper>
          {/*TODO: add agentName name when integrate refresh and fetch chat history api */}
          <AgentInformation isOnline={false} agentName={t("HelpAndSupport.AgentInformation.agentName")} />
        </DismissKeyboardWrapper>
        <FlatList
          inverted={true}
          ref={flatListRef}
          data={chatData.Messages}
          renderItem={renderItem}
          contentContainerStyle={contentContainerStyle}
          ListHeaderComponent={true ? <SupportAgentTimer timeInSeconds={Math.ceil(agentWaitingTime.Ewt)} /> : null} //TODO: add showWaitingTimer instead of true
          keyExtractor={keyExtractor}
          onScroll={handleScroll}
          removeClippedSubviews={true}
          scrollEventThrottle={16}
        />
        {/*TODO: add showAgentTyping when integrate refresh and fetch chat history api */}
        {/* {showAgentTyping ? (
          <DismissKeyboardWrapper>
            <ChatTypingIndicator />
          </DismissKeyboardWrapper>
        ) : null} */}
        {showScrollButton ? <ChatScrollToEndButton onPress={scrollListToEnd} /> : null}
      </Stack>
      <ChatInputBox />
    </>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexBasis: 0,
    flexGrow: 1,
  },
});

export default memo(ChatList);
