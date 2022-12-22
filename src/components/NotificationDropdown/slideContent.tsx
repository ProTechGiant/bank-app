import { GestureResponderEvent, StyleSheet, View } from "react-native";

import Button from "@/components/Button";
import { Notification } from "@/types/notification";
import { spacing } from "@/theme/values";

import Typography from "../Typography";

interface SlideContentProps {
  data: Notification;
  onPress?: (event: GestureResponderEvent) => void;
}

export default function SlideContent({ data, onPress }: SlideContentProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Typography.Text weight="semiBold" color="primaryBase" size="body">
          {data.action_title}
        </Typography.Text>
        <View style={styles.contentWrapper}>
          <Typography.Text weight="regular" color="primaryBase">
            {data.action_message}
          </Typography.Text>
        </View>
      </View>
      <View style={styles.buttonRowWrapper}>
        <View style={styles.row}>
          <View style={[styles.row, styles.rowContent]}>
            <Button variant="primary" color="alt" style={styles.buttonContainer}>
              {data.action_button_text}
            </Button>
          </View>
          <View style={[styles.row, styles.rowContent]}>
            <Button variant="tertiary" onPress={onPress}>
              Dismiss
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    minWidth: 114,
  },
  buttonRowWrapper: {
    paddingBottom: spacing.large,
  },
  container: {
    minHeight: 184,
    justifyContent: "space-between",
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
  },
  contentWrapper: {
    flexDirection: "row",
    marginBottom: spacing.medium,
    paddingTop: spacing.small,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  rowContent: {
    flex: 1,
  },
  textWrapper: {
    justifyContent: "flex-start",
  },
});
