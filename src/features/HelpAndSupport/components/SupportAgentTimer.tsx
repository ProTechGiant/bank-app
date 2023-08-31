import { format } from "date-fns";
import React, { memo, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextStyle, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { useGetAwaitTimer } from "../hooks/query-hooks";
import CircularProgress from "./CircularProgress";

interface SupportAgentTimerProps {
  timeInSeconds: number;
}

function SupportAgentTimer({ timeInSeconds }: SupportAgentTimerProps) {
  const { t } = useTranslation();
  const awaitTimerResponse = useGetAwaitTimer();

  const [remainingSeconds, setRemainingSeconds] = useState<number>(timeInSeconds);
  const [maxTime, setMaxTime] = useState<number>(timeInSeconds);

  const getWaitingTime = async () => {
    const awaitTimer = await awaitTimerResponse.mutateAsync();
    const totalTime = Math.ceil(awaitTimer.Ewt);
    setRemainingSeconds(totalTime);
    setMaxTime(totalTime);
  };

  useLayoutEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingSeconds(prevSeconds => {
        if (prevSeconds <= 0) {
          clearInterval(intervalId);
          getWaitingTime();
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [remainingSeconds]);

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
    <Stack direction="vertical" align="center" style={containerStyle}>
      <Stack direction="vertical" align="center" gap="8p">
        <Typography.Text weight="regular" size="footnote" color="neutralBase+10" style={textLineHeightsStyle}>
          {t("HelpAndSupport.LiveChatScreen.agentTimer.estimatedWaitingTime")}
        </Typography.Text>
        <CircularProgress text={formattedTime} percentage={remainingSeconds} max={maxTime} />
      </Stack>
    </Stack>
  );
}

export default memo(SupportAgentTimer);
