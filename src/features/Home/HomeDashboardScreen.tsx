import { ScrollView, StyleSheet, View } from "react-native";
import AccountInfoHeader from "@/components/AccountInfoHeader";
import QuickAction from "@/components/QuickAction";
import SectionHeader from "@/components/SectionHeader";
import { palette, spacing } from "@/theme/values";
import useNavigation from "@/navigation/use-navigation";

import RewardSection from "@/components/RewardSection";
import ArticleSection from "@/components/ArticleSection";

export default function HomeDashboardScreen() {
  const navigation = useNavigation();

  const handleQuickActionsReorder = () => {
    navigation.navigate("Modal.QuickActionsReorderModal");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <AccountInfoHeader />
      </View>
      <SectionHeader title="Quick actions" subTitle={{ text: "Edit", onPress: handleQuickActionsReorder }} />
      <View style={styles.quickActionWrapper}>
        <QuickAction title="Top-up" iconName="Add" />
        <QuickAction title="Split bill" iconName="Split" />
        <QuickAction title="Transfer" iconName="Transfer" />
      </View>
      <SectionHeader title="Rewards" subTitle={{ text: "See all" }} />
      <RewardSection />
      <SectionHeader title="Articles" subTitle={{ text: "See all" }} />
      <ArticleSection />
    </ScrollView>
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
  quickActionWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: spacing.small,
  },
});
