import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import AccountInfoHeader from "@/components/AccountInfoHeader";
import QuickAction from "@/components/QuickAction";
import SectionHeader from "@/components/SectionHeader";
import { palette, spacing } from "@/theme/values";
import useNavigation from "@/navigation/use-navigation";
import Typography from "@/components/Typography";
import { quickActionReorderItem, ReorderItem } from "@/mocks/quickActionOrderData";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { AccountInfoHeaderProps } from "@/components/AccountInfoHeader";
import RewardSection from "@/components/RewardSection";
import ArticleSection from "@/components/ArticleSection";
import { useState } from "react";

export default function HomeDashboardScreen() {
  const [headerSize, setHeaderSize] = useState<AccountInfoHeaderProps["size"]>("full");
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
          case "whatsnext":
            return (
              <View key={homepageItem.key}>
                <SectionHeader title="What's next" subTitle={{ text: "See all" }} />
                <ArticleSection />
              </View>
            );
        }
      }
    });
  };

  const handleScroll = event => {
    if (event.nativeEvent.contentOffset.y < 44 && headerSize !== "small") {
      setHeaderSize("full");
    } else if (
      event.nativeEvent.contentOffset.y < 74 &&
      event.nativeEvent.contentOffset.y > 44 &&
      headerSize !== "medium"
    ) {
      setHeaderSize("medium");
    } else if (event.nativeEvent.contentOffset.y > 74 && headerSize !== "full") {
      setHeaderSize("small");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={20}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}>
        <AccountInfoHeader size={headerSize} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: spacing.large,
  },
  bottomRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginHorizontal: spacing.small,
    marginBottom: spacing.xlarge * 2,
  },
});
