import { Pressable, StyleSheet, ViewStyle } from "react-native";

import PillButton from "@/components/BulletinBoard/PillButton";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { Notification } from "../types";
import { useTranslation } from "react-i18next";

interface NotificationSlideProps {
  onPress: (notification: Notification) => void;
  notification: Notification;
}

export default function NotificationSlide({ onPress, notification }: NotificationSlideProps) {
  const { t } = useTranslation();

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
  }));

  const ctaStyles = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  return (
    <Stack align="stretch" direction="vertical" gap="4p" style={[containerStyles, styles.grow]}>
      <Typography.Text color="primaryBase" size="body" weight="semiBold">
        {notification.action_title}
      </Typography.Text>
      <Typography.Text color="primaryBase" size="footnote" weight="regular" style={styles.grow}>
        {notification.action_message}
      </Typography.Text>
      <Stack align="center" direction="horizontal" gap="48p" justify="space-evenly" style={ctaStyles}>
        <Pressable>
          <Typography.Text color="primaryBase" size="footnote" weight="regular">
            {t("Home.DashboardScreen.dismiss")}
          </Typography.Text>
        </Pressable>
        <PillButton onPress={() => onPress(notification)}>{notification.action_button_text}</PillButton>
      </Stack>
    </Stack>
  );
}

const styles = StyleSheet.create({
  grow: {
    flexGrow: 1,
  },
});
