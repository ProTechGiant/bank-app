import { useTranslation } from "react-i18next";
import { Pressable, StatusBar, View, ViewStyle } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";

import * as icons from "@/assets/icons";
import Page from "@/components/Page";
import SectionHeader from "@/components/SectionHeader";
import Typography from "@/components/Typography";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { quickActionReorderItem, ReorderItem } from "@/mocks/quickActionOrderData";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import AccountInfoHeader from "./AccountInfoHeader";
import ArticleSection from "./ArticleSection";
import QuickAction from "./QuickAction";
import RewardSection from "./RewardSection";

export default function DashboardScreen() {
  const bottomRowStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginHorizontal: theme.spacing["8p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    borderColor: theme.palette.primaryBase,
    borderRadius: 20,
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 9,
    marginTop: theme.spacing["24p"],
  }));

  const quickActionWrapperStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: theme.spacing["8p"],
  }));

  const navigation = useNavigation();
  const { t } = useTranslation();

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
      const handleOnPress = () => {
        if (quickAction.key === "settings") {
          navigation.navigate("Settings.SettingsScreen");
        }
        if (quickAction.key === "referrals") {
          navigation.navigate("Referral.HubScreen");
        }
        if (quickAction.key === "add") {
          navigation.navigate("AddMoney.AddMoneyStack", { screen: "AddMoney.AddMoneyInfoScreen" });
        }
      };
      return <QuickAction key={quickAction.key} title={quickAction.label} icon={<Icon />} onPress={handleOnPress} />;
    });
  };

  const renderHomepage = (homepageOrderData: ReorderItem[]) => {
    return homepageOrderData.map(homepageItem => {
      if (homepageItem.active) {
        switch (homepageItem.key) {
          case "quickactions":
            return (
              <View key={homepageItem.key}>
                <SectionHeader
                  title={t("Home.DashboardScreen.quickActions")}
                  subTitle={{ text: t("Home.DashboardScreen.edit"), onPress: handleQuickActionsReorder }}
                />
                <View style={quickActionWrapperStyle}>{renderQuickActions(homeScreenLayout.quickActionOrderData)}</View>
              </View>
            );
          case "rewards":
            return (
              <View key={homepageItem.key}>
                <SectionHeader
                  title={t("Home.DashboardScreen.rewards")}
                  subTitle={{ text: t("Home.DashboardScreen.seeAll") }}
                />
                <RewardSection />
              </View>
            );
          case "whatsnext":
            return (
              <View key={homepageItem.key}>
                <SectionHeader
                  title={t("Home.DashboardScreen.whatsNext")}
                  subTitle={{ text: t("Home.DashboardScreen.seeAll") }}
                />
                <ArticleSection />
              </View>
            );
        }
      }
    });
  };

  const lastContentOffset = useSharedValue(0);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: event => {
      lastContentOffset.value = event.contentOffset.y;
    },
  });

  return (
    <Page insets={["left", "right"]}>
      <StatusBar barStyle="light-content" />
      <AccountInfoHeader lastContentOffset={lastContentOffset} />
      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={1}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        bounces={false}>
        {renderHomepage(homeScreenLayout.homepageOrderData)}
        <View style={bottomRowStyle}>
          <Pressable onPress={handleHomepageReorder}>
            <View style={buttonContainerStyle}>
              <Typography.Text color="primaryBase" size="caption1" weight="semiBold">
                {t("Home.DashboardScreen.editDashBoard")}
              </Typography.Text>
            </View>
          </Pressable>
        </View>
      </Animated.ScrollView>
    </Page>
  );
}
