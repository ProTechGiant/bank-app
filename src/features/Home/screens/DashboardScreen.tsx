import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserClockIcon } from "@/assets/icons";
import BulletinBoard from "@/components/BulletinBoard";
import { LoadingErrorNotification } from "@/components/LoadingError";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { ProfileIcon } from "../assets";
import HeaderSvg from "../assets/Header-homepage.svg";
import { BalanceCard, NotificationSlide, QuickActionsSection, RewardsSection, WhatsNextSection } from "../components";
import { useHomepageLayoutOrder } from "../contexts/HomepageLayoutOrderContext";
import { useNotifications, useRefetchHomepageLayout } from "../hooks/query-hooks";
import { AccountMockedData } from "../mocks/MockData";
import { Notification } from "../types";

export default function DashboardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { refetchAll } = useRefetchHomepageLayout();
  const { sections, homepageLayout } = useHomepageLayoutOrder();
  const notifications = useNotifications();

  const [isNotificationsExpanded, setIsNotificationsExpanded] = useState(false);
  const [layoutErrorIsVisible, setLayoutErrorIsVisible] = useState(false);

  useEffect(() => {
    if (homepageLayout?.isError === true) {
      setLayoutErrorIsVisible(true);
    }
  }, [homepageLayout]);

  const handleOnEditLayoutPress = () => {
    navigation.navigate("Home.SectionsReordererModal");
  };

  const handleOnNotificationPress = (notification: Notification) => {
    if (notification.action_type === "Top-Up") {
      navigation.navigate("AddMoney.AddMoneyStack", { screen: "AddMoney.AddMoneyInfoScreen" });
    }
  };

  const handleOnEditShortcutsPress = () => {
    navigation.navigate("Home.QuickActionsReorderModal");
  };

  const handleOnRewardsPress = () => {
    // ..
  };

  const handleOnWhatsNextPress = () => {
    navigation.navigate("WhatsNext.WhatsNextStack");
  };

  const handleOnLoadingErrorClose = () => {
    setLayoutErrorIsVisible(false);
  };

  const handleOnLoadingErrorRefresh = () => {
    refetchAll();
    handleOnLoadingErrorClose();
  };

  const onExpandCollapsPress = (value: boolean) => {
    setIsNotificationsExpanded(value);
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const profileSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    height: 34,
    flexDirection: "row-reverse",
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.backgroundImage}>
        <HeaderSvg />
      </View>
      <SafeAreaView edges={["top"]} style={styles.container}>
        <View style={profileSectionStyle}>
          <Pressable onPress={handleOnEditLayoutPress}>
            <ProfileIcon />
          </Pressable>
        </View>
        <BalanceCard
          balance={AccountMockedData.balance}
          accountNumber={AccountMockedData.accountNumber}
          currency={AccountMockedData.currency}
        />
        <ScrollView contentContainerStyle={contentStyle} scrollEventThrottle={16}>
          <Stack align="stretch" direction="vertical" gap="32p">
            {sections?.length !== 0 ? (
              <>
                <BulletinBoard
                  isExpanded={isNotificationsExpanded}
                  onExpandPress={onExpandCollapsPress}
                  iconStart={<UserClockIcon />}
                  title={t("Home.DashboardScreen.notifications", { count: notifications.length })}>
                  {notifications.map(notification => (
                    <NotificationSlide
                      key={notification.action_id}
                      onPress={handleOnNotificationPress}
                      notification={notification}
                    />
                  ))}
                </BulletinBoard>
                {sections.map(section => {
                  if (section.type === "quick-actions") {
                    return <QuickActionsSection key={section.type} onViewAllPress={handleOnEditShortcutsPress} />;
                  }
                  if (section.type === "rewards") {
                    return <RewardsSection key={section.type} onViewAllPress={handleOnRewardsPress} />;
                  }
                  if (section.type === "articles") {
                    return <WhatsNextSection key={section.type} onViewAllPress={handleOnWhatsNextPress} />;
                  }
                  return <Fragment key={section.type} />;
                })}
              </>
            ) : layoutErrorIsVisible === true ? (
              <LoadingErrorNotification
                isVisible={layoutErrorIsVisible}
                onClose={handleOnLoadingErrorClose}
                onRefresh={handleOnLoadingErrorRefresh}
              />
            ) : null}
          </Stack>
        </ScrollView>
      </SafeAreaView>
    </Page>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
  },
});
