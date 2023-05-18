import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";

import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

const UserBlockedScreen = () => {
  const { t } = useTranslation();
  const [timeInSeconds, setTimeInSeconds] = useState<number>(0);
  const navigation = useNavigation();

  useEffect(() => {
    const interval = setInterval(async () => {
      (async () => {
        const time: string | null = await EncryptedStorage.getItem("blockEndTime");
        if (time !== null) {
          const blockTime: Date = new Date(JSON.parse(time));
          const currentTime: Date = new Date();
          checkTimeDifference(blockTime, currentTime);
        }
      })();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkTimeDifference = (time1: Date, time2: Date) => {
    const seconds = (time1.getTime() - time2.getTime()) / 1000;
    if (seconds > 0) {
      setTimeInSeconds(Math.floor(seconds));
    } else if (seconds < 0) {
      navigation.navigate("SignIn.Passcode");
      setTimeInSeconds(0);
    }
  };

  const container = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.primaryBase,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
    paddingHorizontal: theme.spacing["32p"],
  }));
  const badgeContainer = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
  }));

  const timer = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: theme.spacing["68p"],
  }));

  const badge = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["64p"],
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["20p"],
    borderRadius: theme.radii.xxlarge,
  }));
  const heading = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));
  const message = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["20p"],
    lineHeight: theme.typography.text._lineHeights.footnote,
  }));

  return (
    <View style={container}>
      <View style={badgeContainer}>
        <Typography.Text color="neutralBase-40" style={badge}>
          {t("SignIn.UserBlockedScreen.title")}
        </Typography.Text>
      </View>
      <View>
        <Typography.Text size="xlarge" weight="bold" color="neutralBase-30" align="center" style={heading}>
          {t("SignIn.UserBlockedScreen.heading")}
        </Typography.Text>
        <Typography.Text size="callout" align="center" weight="semiBold" color="neutralBase-50" style={message}>
          {t("SignIn.UserBlockedScreen.message")}
        </Typography.Text>
        <Typography.Text size="callout" align="center" weight="semiBold" color="neutralBase-50" style={message}>
          {t("SignIn.UserBlockedScreen.suggestion")}
        </Typography.Text>
      </View>
      <Typography.Text size="title1" color="neutralBase-20" weight="semiBold" style={timer}>{`${
        timeInSeconds / 60 > 10
          ? Math.floor(timeInSeconds / 60)
          : timeInSeconds / 60 > 0
          ? "0" + Math.floor(timeInSeconds / 60)
          : "00"
      } : ${timeInSeconds % 60 < 10 ? "0" + (timeInSeconds % 60) : timeInSeconds % 60}`}</Typography.Text>
    </View>
  );
};

export default UserBlockedScreen;
