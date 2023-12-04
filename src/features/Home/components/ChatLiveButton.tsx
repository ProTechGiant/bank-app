import React from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { ChatIcon } from "../assets/icons";

interface ChatLiveButtonProps {
  onPress: () => void;
  testID?: string;
}

export default function ChatLiveButton({ onPress, testID }: ChatLiveButtonProps) {
  const { t } = useTranslation();

  const rotatedViewStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["primaryBase-10"],
    padding: theme.spacing["8p"],
    borderTopLeftRadius: theme.spacing["8p"],
    borderTopRightRadius: theme.spacing["8p"],
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: theme.spacing["24p"],
    right: -theme.spacing["20p"],
    transform: [{ rotateZ: I18nManager.isRTL ? "90deg" : "-90deg" }],
  }));

  const chatIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <Pressable
      testID={testID !== undefined ? `${testID}-ButtonPress` : undefined}
      style={containerStyle}
      onPress={onPress}>
      <Stack direction="horizontal" align="center" gap="4p" style={rotatedViewStyle}>
        <ChatIcon color={chatIconColor} />
        <Typography.Text align="center" color="neutralBase-60" size="callout" weight="regular">
          {t("Home.DashboardScreen.ongoingChatButton")}
        </Typography.Text>
      </Stack>
    </Pressable>
  );
}
