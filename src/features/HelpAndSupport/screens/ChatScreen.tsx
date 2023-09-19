import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { hasItemInStorage, removeItemFromEncryptedStorage, setItemInEncryptedStorage } from "@/utils/encrypted-storage";

import { EndChatIcon } from "../assets/icons";
import { ChatList, CloseChattingModal, CustomerFeedbackModal } from "../components";
import { HelpAndSupportStackParams } from "../HelpAndSupportStack";
import { useEndLiveChat } from "../hooks/query-hooks";

export default function ChatScreen() {
  const { t } = useTranslation();

  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<HelpAndSupportStackParams, "HelpAndSupport.ChatScreen">>();
  const { mutateAsync: endLiveChat, isLoading: isEndingChat } = useEndLiveChat();
  const [isCloseChattingModalVisible, setIsCloseChattingModalVisible] = useState(false);
  const [isCustomerFeedbackVisible, setIsCustomerFeedbackVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const handleOnChatSessionEnd = useCallback(() => {
    setIsCustomerFeedbackVisible(true);
  }, []);

  const handleOnChatSessionError = useCallback(() => {
    setIsErrorModalVisible(true);
  }, []);

  const handleOnOpenCloseChatModal = useCallback(() => {
    setIsCloseChattingModalVisible(true);
  }, []);

  const handleOnCloseChatModal = () => {
    setIsCloseChattingModalVisible(false);
  };

  const removeOngoingLiveChat = async () => {
    const hasOngoingChat = await hasItemInStorage("hasOngoingLiveChat");
    if (hasOngoingChat) {
      await removeItemFromEncryptedStorage("hasOngoingLiveChat");
    }
  };

  const handleOnPressOk = async () => {
    try {
      const response = await endLiveChat();
      await removeOngoingLiveChat();
      if (response.ChatEnded) {
        setIsCloseChattingModalVisible(false);
        setIsCustomerFeedbackVisible(true);
      }
    } catch (error) {
      warn("Failed to disconnect the chat", JSON.stringify(error));
    }
  };

  const handleOnFeedbackExit = async () => {
    await removeOngoingLiveChat();
    setIsCustomerFeedbackVisible(false);
    navigation.navigate("Home.DashboardScreen");
  };

  const setHasOngoingLiveChatToStorage = async () => {
    await setItemInEncryptedStorage("hasOngoingLiveChat", JSON.stringify(params));
  };

  const handelOnBackPress = async () => {
    await setHasOngoingLiveChatToStorage();
    navigation.navigate("Home.DashboardScreen");
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={t("HelpAndSupport.ChatScreen.headerText")}
        end={<NavHeader.IconEndButton icon={<EndChatIcon />} onPress={handleOnOpenCloseChatModal} />}
        onBackPress={handelOnBackPress}
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.containerStyle}>
        <ChatList
          onChatSessionError={handleOnChatSessionError}
          onChatSessionEnd={handleOnChatSessionEnd}
          initialChatData={params.chatResponse}
          agentWaitingTime={params.awaitTimeData}
          enquiryType={params.enquiryType}
          subEnquiryType={params.subEnquiryType}
          isOngoingChat={params.isOngoingChat}
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
      <NotificationModal
        title={t("HelpAndSupport.LiveChatScreen.error.title")}
        message={t("HelpAndSupport.LiveChatScreen.error.message")}
        isVisible={isErrorModalVisible}
        variant="error"
        onClose={() => setIsErrorModalVisible(false)}
        buttons={{
          primary: <Button onPress={() => setIsErrorModalVisible(false)}>{t("errors.generic.button")}</Button>,
        }}
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
