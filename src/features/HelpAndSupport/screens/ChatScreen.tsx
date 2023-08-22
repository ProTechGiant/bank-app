import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";

import { ChatInputBox, ChatList, HeaderText } from "../components";

export default function ChatScreen() {
  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={<HeaderText categoryName="Fraud" />} //TODO: add header and translation as in figma
        end={<NavHeader.CloseEndButton hasBackground={true} onPress={() => undefined} />}
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.containerStyle}>
        <ChatList />
        <ChatInputBox />
      </KeyboardAvoidingView>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexBasis: 0,
    flexGrow: 1,
  },
});
