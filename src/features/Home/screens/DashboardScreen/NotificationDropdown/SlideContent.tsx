import { GestureResponderEvent, StyleSheet, View, ViewStyle } from "react-native";

import { Notification } from "@/Axios/notification";
import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface SlideContentProps {
  data: Notification;
  onPress?: (event: GestureResponderEvent) => void;
}

export default function SlideContent({ data, onPress }: SlideContentProps) {
  const buttonRowWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingBottom: theme.spacing.large,
    }),
    []
  );
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      justifyContent: "space-between",
      minHeight: 184,
      paddingHorizontal: theme.spacing.medium,
      paddingVertical: theme.spacing.small,
    }),
    []
  );
  const contentWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      marginBottom: theme.spacing.medium,
      paddingTop: theme.spacing.small,
    }),
    []
  );

  return (
    <View style={container}>
      <View style={styles.textWrapper}>
        <Typography.Text weight="semiBold" color="primaryBase" size="body">
          {data.action_title}
        </Typography.Text>
        <View style={contentWrapperStyle}>
          <Typography.Text weight="regular" color="primaryBase">
            {data.action_message}
          </Typography.Text>
        </View>
      </View>
      <View style={buttonRowWrapperStyle}>
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
