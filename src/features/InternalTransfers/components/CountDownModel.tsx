import moment from "moment";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import ProgressCircle from "react-native-progress-circle2";

import { CancelCircleFilledIcon } from "@/assets/icons";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import AlarmIcon from "../assets/AlarmIcon";

interface CountDownModelProps {
  onClose?: () => void;
  message?: string;
  isVisible: boolean;
  title: string;
  testID?: string;
  deviceSignInDate: string;
  children?: ReactNode;
  style?: ViewStyle;
}

// @see https://www.figma.com/file/QOqqlaJOVnmvKjmRqIPryO/Croatia-Core-Theme?node-id=2669%3A12208&t=48I2T8XT844CfKFB-0
export default function CountDownModel({
  onClose,
  message,
  isVisible,
  testID,
  deviceSignInDate,
  title,
  children,
  style,
}: CountDownModelProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginTop: theme.spacing["16p"],
  }));

  const { t } = useTranslation();
  const signIndate = moment(deviceSignInDate); //deviceSignInDate
  const now = moment(new Date());
  const timeDifference = now.diff(signIndate);
  const timeDuration = moment.duration(timeDifference);

  const percentageValue = (timeDuration.asMilliseconds() / 86400000) * 100;

  const formattedTime = timeDuration.hours() + ":" + timeDuration.minutes() + ":" + timeDuration.seconds();
  const [hours, minutes, seconds] = formattedTime.split(":");

  const currentDate = new Date();
  const targetDate = new Date();
  targetDate.setHours(24, 0, 0, 0);
  currentDate.setHours(hours, minutes, seconds, 0);

  const reamainingTime = targetDate - currentDate;
  const remainingHours = Math.floor(reamainingTime / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((reamainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const remainingSeconds = Math.floor((reamainingTime % (1000 * 60)) / 1000);

  const reaminingTimeText = `${String(remainingHours).padStart(2, "0")}:${String(remainingMinutes).padStart(
    2,
    "0"
  )}:${String(remainingSeconds).padStart(2, "0")}`;

  const [countdown, setCountdown] = useState<number>(timeDuration.asMilliseconds());
  useEffect(() => {
    setCountdown(timeDuration.asMilliseconds());
  }, []);

  useEffect(() => {
    if (countdown === 0) return;
    const interval = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);
  const containerWithButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: -theme.spacing["32p"],
  }));

  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.xlarge,
    borderTopStartRadius: theme.radii.xlarge,
    borderTopEndRadius: theme.radii.xlarge,
    marginBottom: theme.spacing["32p"],
    marginHorizontal: theme.spacing["12p"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  return (
    <Modal visible={isVisible} style={[modalStyle, style]} onClose={onClose} padding="24p" testID={testID}>
      <View style={[containerStyle, onClose !== undefined && containerWithButtonStyle]}>
        <View>
          <CancelCircleFilledIcon />
        </View>
        <Stack direction="vertical" gap="16p" align="center" style={contentStyle}>
          <Typography.Text color="neutralBase+30" weight="medium" size="title2" align="center">
            {title}
          </Typography.Text>
          <Typography.Text color="neutralBase+10" weight="regular" size="callout" align="center">
            {message}
          </Typography.Text>
          <ProgressCircle
            percent={percentageValue}
            radius={100}
            borderWidth={8}
            color="#FF523D"
            shadowColor="#F1F1F4"
            bgColor="#fff">
            <AlarmIcon />
            <Text style={styles.timerTextStyle}>{reaminingTimeText}</Text>
            <Text style={styles.timerSubTextStyle}>
              {t("InternalTransfers.DeviceControlModelScreen.remainingText")}
            </Text>
          </ProgressCircle>
        </Stack>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  timerSubTextStyle: {
    alignContent: "center",
    alignItems: "center",
    color: "#78758A",
    fontSize: 15,
    padding: 5,
  },
  timerTextStyle: {
    alignContent: "center",
    alignItems: "center",
    fontSize: 25,
    fontWeight: "bold",
    padding: 5,
  },
});
