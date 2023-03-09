import Clipboard from "@react-native-clipboard/clipboard";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AccountIcon, HideIcon, ShowIcon, UserClockIcon } from "@/assets/icons";
import BulletinBoard from "@/components/BulletinBoard";
import Button from "@/components/Button";
import DismissibleBanner from "@/components/DismissibleBanner";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useAccount from "@/hooks/use-account";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import BackgroundCollapsedSvg from "../../background-header-collapsed.svg";
import { useLayout } from "../../contexts/LayoutContext";
import BackgroundExpandedSvg from "./background-header-expanded.svg";
import HeaderButton from "./HeaderButton";
import NotificationSlide from "./NotificationSlide";
import QuickActionsSection from "./sections/QuickActionsSection";
import RewardsSection from "./sections/RewardsSection";
import WhatsNextSection from "./sections/WhatsNextSection";
import { Notification } from "./types";
import useNotifications from "./use-notifications";

const formatter = Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 2 });
export default function DashboardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { sections } = useLayout();
  const account = useAccount();
  const notifications = useNotifications();

  const [ibanToastVisible, setIbanToastVisible] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isNotificationsExpanded, setIsNotificationsExpanded] = useState(false);

  const handleOnIbanCopyPress = () => {
    Clipboard.setString("Some string...");

    setIbanToastVisible(true);
    setTimeout(() => setIbanToastVisible(false), 4 * 1000);
  };

  const handleOnAccountPress = () => {
    // ..
  };

  const handleOnNotificationPress = (notification: Notification) => {
    // ..
  };

  const handleOnShortcutsPress = () => {
    navigation.navigate("Home.QuickActionsReorderModal");
  };

  const handleOnEditPress = () => {
    navigation.navigate("Home.SectionsReordererModal");
  };

  const handleOnRewardsPress = () => {
    // ..
  };

  const handleOnWhatsNextPress = () => {
    // ..
  };

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingTop: theme.spacing["12p"],
    paddingBottom: theme.spacing["12p"],
  }));

  const headerBalanceStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "baseline",
    flexDirection: "row",
    paddingTop: theme.spacing["24p"],
  }));

  const headerButtonsStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
    marginBottom: theme.spacing["24p"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const footerButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["20p"],
  }));

  return (
    <>
      {/* eslint-disable-next-line prettier/prettier */}
      <DismissibleBanner
        visible={ibanToastVisible}
        message={t("Home.DashboardScreen.ibanCopied")}
      />
      <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom"]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.backgroundImage}>
          {/* Ideally we do this animated. Not sure (yet) how we can do that though.. */}
          {isNotificationsExpanded ? <BackgroundExpandedSvg /> : <BackgroundCollapsedSvg />}
        </View>
        <SafeAreaView edges={["top"]} style={styles.container}>
          <View style={headerStyle}>
            <View style={styles.headerCentered}>
              <Typography.Text color="primaryBase+10" size="footnote" weight="medium" style={styles.headerText}>
                {account.data?.currentAccountName ?? "-"}
              </Typography.Text>
              <Pressable onPress={handleOnIbanCopyPress}>
                <Typography.Text color="primaryBase+10" size="footnote" weight="medium" style={styles.headerText}>
                  {account.data?.currentAccountIban ?? "-"}
                </Typography.Text>
              </Pressable>
              <View style={headerBalanceStyle}>
                {isBalanceVisible ? (
                  <>
                    <Typography.Header color="primaryBase+10" size="large" weight="semiBold">
                      {formatter.format(account.data?.currentAccountBalance ?? 0)}
                    </Typography.Header>
                    <Typography.Text color="primaryBase+10" size="footnote" weight="regular">
                      {" " + (account.data?.currentAccountCurrencyType ?? "SAR")}
                    </Typography.Text>
                  </>
                ) : (
                  <Typography.Text color="primaryBase+10" size="body" weight="regular">
                    {t("Home.DashboardScreen.balanceHidden")}
                  </Typography.Text>
                )}
              </View>
              <Stack direction="horizontal" gap="8p" style={headerButtonsStyle}>
                <HeaderButton
                  onPress={() => setIsBalanceVisible(c => !c)}
                  iconStart={isBalanceVisible ? <ShowIcon /> : <HideIcon />}>
                  {isBalanceVisible
                    ? t("Home.DashboardScreen.hideBalanceButton")
                    : t("Home.DashboardScreen.showBalanceButton")}
                </HeaderButton>
                <HeaderButton iconStart={<AccountIcon />} onPress={handleOnAccountPress}>
                  {t("Home.DashboardScreen.myAccountButton")}
                </HeaderButton>
              </Stack>
            </View>
            <BulletinBoard
              isExpanded={isNotificationsExpanded}
              onExpandPress={value => setIsNotificationsExpanded(value)}
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
          </View>
          <ScrollView contentContainerStyle={contentStyle}>
            <Stack align="stretch" direction="vertical" gap="32p">
              {sections.map(section => {
                if (section.type === "quick-actions") {
                  return <QuickActionsSection key={section.type} onViewAllPress={handleOnShortcutsPress} />;
                }

                if (section.type === "rewards") {
                  return <RewardsSection key={section.type} onViewAllPress={handleOnRewardsPress} />;
                }

                if (section.type === "whats-next") {
                  return <WhatsNextSection key={section.type} onViewAllPress={handleOnWhatsNextPress} />;
                }

                return <Fragment key={section.type} />;
              })}
            </Stack>

            <View style={footerButtonStyle}>
              <Button onPress={handleOnEditPress} variant="tertiary">
                Edit Dashboard
              </Button>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Page>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
  },
  // including this directly in headerStyles has the side-effect of making the BulletinBoard fill the entire screen
  headerCentered: {
    alignItems: "center",
  },
  headerText: {
    textTransform: "uppercase",
  },
});
