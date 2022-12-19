import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import AccountInfoHeader from "@/components/AccountInfoHeader";
import QuickAction from "@/components/QuickAction";
import SectionHeader from "@/components/SectionHeader";
import { palette, spacing } from "@/theme/values";
import useNavigation from "@/navigation/use-navigation";
import Typography from "@/components/Typography";
import RewardSection from "@/components/RewardSection";
import ArticleSection from "@/components/ArticleSection";
import { quickActionReorderItem, ReorderItem } from "@/mocks/quickActionOrderData";
import { useGlobalContext } from "@/contexts/GlobalContext";

export default function HomeDashboardScreen() {
  const navigation = useNavigation();

  const handleQuickActionsReorder = () => {
    navigation.navigate("Modal.QuickActionsReorderModal");
  };
  const handleHomepageReorder = () => {
    navigation.navigate("Modal.HomepageReorderModal");
  };
  const { homeScreenLayout } = useGlobalContext();

  const renderQuickActions = (quickActionOrderData: quickActionReorderItem[]) => {
    return quickActionOrderData.map(quickAction => {
      if (quickAction.active) {
        return (
          <QuickAction
            key={quickAction.key}
            title={quickAction.label}
            iconName={quickAction.icon ? quickAction.icon : "InfoCircle"}
          />
        );
      }
    });
  };
  const renderHomepage = (homepageOrderData: ReorderItem[]) => {
    return homepageOrderData.map(homepageItem => {
      if (homepageItem.active) {
        switch (homepageItem.key) {
          case "quickactions":
            return (
              <View key={homepageItem.key}>
                <SectionHeader title="Quick actions" subTitle={{ text: "Edit", onPress: handleQuickActionsReorder }} />
                <View style={styles.quickActionWrapper}>
                  {renderQuickActions(homeScreenLayout.quickActionOrderData)}
                </View>
              </View>
            );
            break;
          case "rewards":
            return (
              <View key={homepageItem.key}>
                <SectionHeader title="Rewards" subTitle={{ text: "See all" }} />
                <RewardSection />
              </View>
            );
          case "articles":
            return (
              <View key={homepageItem.key}>
                <SectionHeader title="Articles" subTitle={{ text: "See all" }} />
                <ArticleSection />
              </View>
            );
        }
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <AccountInfoHeader />
      </View>
      {renderHomepage(homeScreenLayout.homepageOrderData)}

      <View style={[styles.bottomRow]}>
        <Pressable onPress={handleHomepageReorder}>
          <View style={[styles.buttonContainer]}>
            <Typography.Text color="primaryBase" size="caption1" weight="semiBold">
              EDIT DASHBOARD
            </Typography.Text>
          </View>
        </Pressable>
      </View>
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
  buttonContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: palette.primaryBase,
    padding: 9,
  },
  bottomRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginHorizontal: spacing.small,
    marginVertical: spacing.medium,
  },
});
