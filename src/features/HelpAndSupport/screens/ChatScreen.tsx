import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";

import { ChatInputBox, ChatList, CloseChattingModal, CustomerFeedbackModal, HeaderText } from "../components";
import { useEndLiveChat } from "../hooks/query-hooks";

export default function ChatScreen() {
  const navigation = useNavigation();
  const { mutateAsync: endLiveChat, isLoading: isEndingChat } = useEndLiveChat();
  const [isCloseChattingModalVisible, setIsCloseChattingModalVisible] = useState(false); // State to control the visibility of the CloseChattingModal
  const [isCustomerFeedbackVisible, setIsCustomerFeedbackVisible] = useState(false); // State to control the visibility of the CustomerFeedback

  const handleOnOpenCloseChatModal = () => {
    setIsCloseChattingModalVisible(true);
  };

  const handleOnCloseChatModal = () => {
    setIsCloseChattingModalVisible(false);
  };

  const handleOnPressOk = async () => {
    try {
      const response = await endLiveChat();
      if (response.ChatEnded) {
        setIsCloseChattingModalVisible(false);
        setIsCustomerFeedbackVisible(true);
      }
    } catch (error) {
      warn("Failed to disconnect the chat", JSON.stringify(error));
    }
  };

  const handleOnFeedbackExit = () => {
    setIsCustomerFeedbackVisible(false);
    navigation.goBack();
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={<HeaderText categoryName="Fraud" />} //TODO: add header and translation as in figma
        end={<NavHeader.CloseEndButton hasBackground={true} onPress={handleOnOpenCloseChatModal} />}
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.containerStyle}>
        <ChatList />
        <ChatInputBox />
      </KeyboardAvoidingView>
      <CloseChattingModal
        isVisible={isCloseChattingModalVisible}
        onClose={handleOnCloseChatModal}
        onPressOk={handleOnPressOk}
        isLoading={isEndingChat}
      />
      <CustomerFeedbackModal
        isVisible={isCustomerFeedbackVisible}
        onSkip={handleOnFeedbackExit}
        onSubmit={handleOnFeedbackExit}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexBasis: 0,
    flexGrow: 1,
  },
});
