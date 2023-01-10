import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import * as icons from "@/assets/icons";
import SectionHeader from "@/components/SectionHeader";
import Typography from "@/components/Typography";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { quickActionReorderItem, ReorderItem } from "@/mocks/quickActionOrderData";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import AccountInfoHeader, { AccountInfoHeaderProps } from "./AccountInfoHeader";
import ArticleSection from "./ArticleSection";
import QuickAction from "./QuickAction";
import RewardSection from "./RewardSection";

export default function DashboardScreen() {
  const bottomRowStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginBottom: theme.spacing.xlarge * 2,
      marginHorizontal: theme.spacing.small,
    }),
    []
  );
  const buttonContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      borderColor: theme.palette.primaryBase,
      borderRadius: 20,
      borderStyle: "solid",
      borderWidth: 1,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      marginTop: theme.spacing.large,
      padding: 9,
    }),
    []
  );
  const quickActionWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginHorizontal: theme.spacing.small,
    }),
    []
  );
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
      if (!quickAction.active) return null;

      const Icon = quickAction.icon in icons ? icons[quickAction.icon] : icons.InfoCircleIcon;
      return <QuickAction key={quickAction.key} title={quickAction.label} icon={<Icon />} />;
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
                <View style={quickActionWrapperStyle}>{renderQuickActions(homeScreenLayout.quickActionOrderData)}</View>
              </View>
            );
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

  useEffect(() => {
    setHeaderSize("full");
  }, [homeScreenLayout]);

  return (
    <View style={styles.container}>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={20}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}>
        <AccountInfoHeader size={headerSize} />
        {renderHomepage(homeScreenLayout.homepageOrderData)}

        <View style={bottomRowStyle}>
          <Pressable onPress={handleHomepageReorder}>
            <View style={buttonContainerStyle}>
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
});
