import { useTranslation } from "react-i18next";
import { I18nManager, TextInput as RNTextInput, TextStyle, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

interface ChatMessageInputProps {
  onChangeText: (value: string) => void;
  value: string;
}

const ChatMessageInput = ({ onChangeText, value }: ChatMessageInputProps) => {
  const { t } = useTranslation();

  const messageInputStyle = useThemeStyles<ViewStyle & TextStyle>(theme => ({
    color: theme.palette["neutralBase+30"],
    fontSize: theme.typography.text.sizes.callout,
    fontWeight: theme.typography.text.weights.regular,
    marginVertical: theme.spacing["12p"],
    maxHeight: theme.spacing["64p"],
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 0,
    minWidth: 0,
    alignSelf: "center",
  }));

  const messagePlaceholderTextStyle = useThemeStyles(theme => theme.palette["neutralBase-10"]);

  return (
    <RNTextInput
      style={messageInputStyle}
      placeholderTextColor={messagePlaceholderTextStyle}
      onChangeText={onChangeText}
      value={value}
      textAlign={I18nManager.isRTL ? "right" : "left"}
      placeholder={t("HelpAndSupport.ChatScreen.chatInputPlaceholder")}
      multiline
    />
  );
};

export default ChatMessageInput;
