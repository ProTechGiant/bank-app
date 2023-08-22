import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";

import { ChatInputBox, ChatTypingIndicator, HeaderText } from "../components";

export default function ChatScreen() {
  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={<HeaderText categoryName="Fraud" />} //TODO: add header and translation as in figma
        end={<NavHeader.CloseEndButton hasBackground={true} onPress={() => undefined} />}
      />
      {/* TODO: Add component for chat messages here */}
      <ChatTypingIndicator />
      <ChatInputBox />
    </Page>
  );
}
