import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";

import { EndChatIcon } from "../assets/icons";
import { ChatList, CloseChattingModal, CustomerFeedbackModal } from "../components";
import { HelpAndSupportStackParams } from "../HelpAndSupportStack";
import { useEndLiveChat } from "../hooks/query-hooks";

export default function ChatScreen() {
  const { t } = useTranslation();

  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<HelpAndSupportStackParams, "HelpAndSupport.ChatScreen">>();
  const { mutateAsync: endLiveChat, isLoading: isEndingChat } = useEndLiveChat();
  const [isCloseChattingModalVisible, setIsCloseChattingModalVisible] = useState(false); // State to control the visibility of the CloseChattingModal
  const [isCustomerFeedbackVisible, setIsCustomerFeedbackVisible] = useState(false); // State to control the visibility of the CustomerFeedback

  const handleOnOpenCloseChatModal = useCallback(() => {
    setIsCloseChattingModalVisible(true);
  }, []);

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
    navigation.navigate("Home.HomeStack");
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={t("HelpAndSupport.ChatScreen.headerText")}
        end={<NavHeader.IconEndButton icon={<EndChatIcon />} onPress={handleOnOpenCloseChatModal} />}
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.containerStyle}>
        <ChatList
          onChatSessionEnd={handleOnOpenCloseChatModal}
          initialChatData={params.chatResponse}
          agentWaitingTime={params.awaitTimeData}
          enquiryType={params.enquiryType}
        />
      </KeyboardAvoidingView>
      {!isCustomerFeedbackVisible ? (
        <CloseChattingModal
          isVisible={isCloseChattingModalVisible}
          onClose={handleOnCloseChatModal}
          onPressOk={handleOnPressOk}
          isLoading={isEndingChat}
        />
      ) : null}
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
