import { StyleSheet, TouchableOpacity, View } from "react-native";

import Typography from "@/components/Typography";
import { palette } from "@/theme/values";

export default function HomeDashboardScreen() {
  const sectionHeader = (primaryText: string, secondaryText: string) => {
    return (
      <View style={styles.sectionContainer}>
        <Typography.Text size="footnote" weight="medium" color="primaryBase-20">
          {primaryText.toUpperCase()}
        </Typography.Text>
        <TouchableOpacity>
          <Typography.Text size="footnote" weight="medium" color="primaryBase-20">
            {secondaryText}
          </Typography.Text>
        </TouchableOpacity>
      </View>
    );
  };

  const getCardNumber = () => {
    return "8394 2748 2929";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography.Text color="neutralBase-50" weight="medium" size="callout">
          MAIN ACCOUNT
        </Typography.Text>
        <Typography.Text color="neutralBase-50">{getCardNumber()}</Typography.Text>
      </View>
      {sectionHeader("Quick actions", "Edit")}
      {sectionHeader("Rewards", "See all")}
      {sectionHeader("ArticleS", "See all")}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  header: {
    backgroundColor: palette.primaryBase,
    alignItems: "center",
    width: "100%",
    padding: 20,
    paddingTop: 40,
  },
  sectionContainer: {
    padding: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
