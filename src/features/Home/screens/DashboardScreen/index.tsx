import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  View,
  ViewStyle,
} from "react-native";

import * as icons from "@/assets/icons";
import Page from "@/components/Page";
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
      marginBottom: theme.spacing["32p"] * 2,
      marginHorizontal: theme.spacing["8p"],
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
      marginTop: theme.spacing["24p"],
      padding: 9,
    }),
    []
  );
  const quickActionWrapperStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginHorizontal: theme.spacing["8p"],
    }),
    []
  );
  const [headerSize, setHeaderSize] = useState<AccountInfoHeaderProps["size"]>("full");
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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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
    <Page insets={["bottom", "left", "right"]}>
      <StatusBar barStyle="light-content" />
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
                {t("Home.DashboardScreen.editDashBoard")}
              </Typography.Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </Page>
  );
}
