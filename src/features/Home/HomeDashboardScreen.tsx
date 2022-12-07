import { StyleSheet, View } from "react-native";

import NotificationDropdown from "@/components/NotificationDropdown";
import QuickAction from "@/components/QuickAction";
import SectionHeader from "@/components/SectionHeader";
import Typography from "@/components/Typography";
import { palette, spacing } from "@/theme/values";

export default function HomeDashboardScreen() {
  const cardNumber = "8394 2748 2929";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography.Text color="neutralBase-50" weight="medium" size="callout">
          MAIN ACCOUNT
        </Typography.Text>
        <Typography.Text color="neutralBase-50">{cardNumber}</Typography.Text>
        <View style={styles.notificationDropdownWrapper}>
          <NotificationDropdown />
        </View>
      </View>
      <SectionHeader title="Quick actions" subTitle={{ text: "Edit" }} />
      <View style={styles.quickActionWrapper}>
        <QuickAction title="Top-up" iconName="Add" />
        <QuickAction title="Split bill" iconName="Split" />
        <QuickAction title="Transfer" iconName="Transfer" />
      </View>
      <SectionHeader title="Rewards" subTitle={{ text: "See all" }} />
      <SectionHeader title="Articles" subTitle={{ text: "See all" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    backgroundColor: palette.primaryBase,
    padding: spacing.medium,
    paddingTop: 40,
  },
  notificationDropdownWrapper: {
    marginVertical: spacing.medium,
  },
  quickActionWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: spacing.small,
  },
});
