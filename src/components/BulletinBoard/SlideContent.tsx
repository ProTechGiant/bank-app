import { StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { Notification } from "@/types/notification";

import PillButton from "./PillButton";

interface SlideContentProps {
  data: Notification;
}

export default function SlideContent({ data }: SlideContentProps) {
  const buttonRowWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingBottom: theme.spacing["8p"],
      justifyContent: "flex-end",
    }),
    []
  );
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing["16p"],
      paddingVertical: theme.spacing["8p"],
    }),
    []
  );
  const contentWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      marginBottom: theme.spacing["24p"],
      paddingTop: theme.spacing["8p"],
    }),
    []
  );

  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate(data.action_link);
  };

  return (
    <View style={container}>
      <View style={styles.textWrapper}>
        <Typography.Text weight="semiBold" color="primaryBase" size="body">
          {data.action_title}
        </Typography.Text>
        <View style={contentWrapperStyle}>
          <Typography.Text weight="regular" color="primaryBase" size="callout">
            {data.action_message}
          </Typography.Text>
        </View>
      </View>
      <View style={buttonRowWrapperStyle}>
        <PillButton onPress={onPress}>{data.action_button_text}</PillButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textWrapper: {
    justifyContent: "flex-start",
  },
});
