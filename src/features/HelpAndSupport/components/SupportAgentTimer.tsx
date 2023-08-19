import { format } from "date-fns";
import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextStyle, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import CircularProgress from "./CircularProgress";

interface SupportAgentTimerProps {
  timeInSeconds: number;
}

export default function SupportAgentTimer({ timeInSeconds }: SupportAgentTimerProps) {
  const { t } = useTranslation();

  const [remainingSeconds, setRemainingSeconds] = useState<number>(timeInSeconds);

  useLayoutEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingSeconds(prevSeconds => {
        if (prevSeconds <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedTime = format(new Date(remainingSeconds * 1000), "mm:ss");

  const textLineHeightsStyle = useThemeStyles<TextStyle>(theme => ({
    lineHeight: theme.typography.text._lineHeights.footnote,
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    alignSelf: "stretch",
    gap: theme.spacing["8p"],
    justifyContent: "center",
    padding: theme.spacing["16p"],
  }));

  return (
    <View style={containerStyle}>
      <Typography.Text weight="regular" size="footnote" color="neutralBase+10" style={textLineHeightsStyle}>
        {t("HelpAndSupport.LiveChatScreen.agentTimer.estimatedWaitingTime")}
      </Typography.Text>
      <CircularProgress text={formattedTime} percentage={remainingSeconds} max={timeInSeconds} />
    </View>
  );
}
