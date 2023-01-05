import { GestureResponderEvent, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import { NotificationIcon, UpArrowIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { pluralize } from "@/utils";

interface DropdownContentProps {
  length: number;
  dropdownVisible?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}

export default function NotificationsTitle({ length, dropdownVisible, onPress }: DropdownContentProps) {
  const paddingLeftStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingLeft: theme.spacing.small,
    }),
    []
  );
  const titleContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-50"],
      borderRadius: theme.radii.extraSmall,
      flexDirection: "row",
      padding: theme.spacing.medium,
      shadowColor: theme.palette["tintBase+20"],
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.14,
    }),
    []
  );
  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.notifications, []);

  const title = pluralize(length, "notification", "s");

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
          <UpArrowIcon width={iconDimensions} height={iconDimensions} />
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
