import { GestureResponderEvent, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import { DownArrowIcon, NotificationIcon, UpArrowIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface BulletinTitleProps {
  title: string;
  dropdownVisible?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}

export default function BulletinTitle({ title, dropdownVisible, onPress }: BulletinTitleProps) {
  const paddingLeftStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingLeft: theme.spacing["8p"],
    }),
    []
  );
  const titleContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
      borderRadius: theme.radii.extraSmall,
      flexDirection: "row",
      padding: theme.spacing["16p"],
      shadowColor: theme.palette["tintBase+20"],
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.14,
      elevation: 5,
    }),
    []
  );
  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.notifications, []);

  return (
    <TouchableOpacity onPress={onPress} style={titleContainerStyle}>
      <View style={styles.titleWrapper}>
        <View style={styles.subRow}>
          <NotificationIcon width={iconDimensions} height={iconDimensions} />
          <View style={paddingLeftStyle}>
            <Typography.Text color="primaryBase" size="callout" weight="semiBold">
              {title}
            </Typography.Text>
          </View>
        </View>
        {dropdownVisible ? (
          <UpArrowIcon width={iconDimensions} height={iconDimensions} />
        ) : (
          <DownArrowIcon width={iconDimensions} height={iconDimensions} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  subRow: {
    flexDirection: "row",
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
