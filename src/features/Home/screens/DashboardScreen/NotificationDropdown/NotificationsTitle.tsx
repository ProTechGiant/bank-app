import { GestureResponderEvent, StyleSheet, TouchableOpacity, View } from "react-native";

import { UpArrowIcon, NotificationIcon } from "@/assets/icons";
import { iconDimensions, palette, radii, spacing } from "@/theme/values";
import { pluralize } from "@/utils";

import Typography from "@/components/Typography";

interface DropdownContentProps {
  length: number;
  dropdownVisible?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}

export default function NotificationsTitle({ length, dropdownVisible, onPress }: DropdownContentProps) {
  const title = pluralize(length, "notification", "s");

  return (
    <TouchableOpacity onPress={onPress} style={styles.titleContainer}>
      <View style={styles.titleWrapper}>
        <View style={styles.subRow}>
          <NotificationIcon width={iconDimensions.notifications} height={iconDimensions.notifications} />
          <View style={styles.paddingLeft}>
            <Typography.Text color="primaryBase" size="callout" weight="semiBold">
              {title}
            </Typography.Text>
          </View>
        </View>
        {dropdownVisible ? (
          <UpArrowIcon width={iconDimensions.notifications} height={iconDimensions.notifications} />
        ) : (
          <UpArrowIcon width={iconDimensions.notifications} height={iconDimensions.notifications} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  paddingLeft: {
    paddingLeft: spacing.small,
  },
  subRow: {
    flexDirection: "row",
  },
  titleContainer: {
    backgroundColor: palette["neutralBase-50"],
    borderRadius: radii.extraSmall,
    flexDirection: "row",
    padding: spacing.medium,
    shadowColor: palette["tintBase+20"],
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.14,
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
