import Clipboard from "@react-native-clipboard/clipboard";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AccountIcon, HideIcon, ShowIcon, UserClockIcon } from "@/assets/icons";
import BulletinBoard from "@/components/BulletinBoard";
import Button from "@/components/Button";
import { LoadingErrorNotification } from "@/components/LoadingError";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useToasts } from "@/contexts/ToastsContext";
import { useCurrentAccount } from "@/hooks/use-accounts";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import BackgroundCollapsedSvg from "../assets/background-header-collapsed.svg";
import BackgroundExpandedSvg from "../assets/background-header-expanded.svg";
import { HeaderButton, NotificationSlide, QuickActionsSection, RewardsSection, WhatsNextSection } from "../components";
import { useHomepageLayoutOrder } from "../contexts/HomepageLayoutOrderContext";
import { useNotifications, useRefetchHomepageLayout } from "../hooks/query-hooks";
import { Notification } from "../types";

export default function DashboardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { refetchAll } = useRefetchHomepageLayout();

  const { sections, homepageLayout } = useHomepageLayoutOrder();
  const account = useCurrentAccount();
  const notifications = useNotifications();
  const toast = useToasts();

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isNotificationsExpanded, setIsNotificationsExpanded] = useState(false);
  const [layoutErrorIsVisible, setLayoutErrorIsVisible] = useState(false);

  useEffect(() => {
    if (homepageLayout?.isError === true) {
      setLayoutErrorIsVisible(true);
    }
  }, [homepageLayout]);

  const handleOnIbanCopyPress = () => {
    if (undefined === account.data?.iban) return;
    Clipboard.setString(account.data.iban);

    toast.add({ variant: "confirm", message: t("Home.DashboardScreen.ibanCopied") });
  };

  const handleOnAccountPress = () => {
    navigation.navigate("Home.AccountDetailsScreen");
  };

  const handleOnNotificationPress = (notification: Notification) => {
    if (notification.action_type === "Top-Up") {
      navigation.navigate("AddMoney.AddMoneyStack", { screen: "AddMoney.AddMoneyInfoScreen" });
    }
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
    navigation.navigate("WhatsNext.WhatsNextStack");
  };

  const handleOnLoadingErrorClose = () => {
    setLayoutErrorIsVisible(false);
  };

  const handleOnLoadingErrorRefresh = () => {
    refetchAll();
    handleOnLoadingErrorClose();
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
      <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom"]}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={styles.backgroundImage}>
          {/* Ideally we do this animated. Not sure (yet) how we can do that though.. */}
          {isNotificationsExpanded ? <BackgroundExpandedSvg /> : <BackgroundCollapsedSvg />}
        </View>
        <SafeAreaView edges={["top"]} style={styles.container}>
          <View style={headerStyle}>
            <View style={styles.headerCentered}>
              <Typography.Text color="neutralBase+30" size="footnote" weight="medium" style={styles.headerText}>
                {account.data?.name ?? "-"}
              </Typography.Text>
              <Pressable onPress={handleOnIbanCopyPress}>
                <Typography.Text color="neutralBase+30" size="footnote" weight="medium" style={styles.headerText}>
                  {account.data?.iban ?? "-"}
                </Typography.Text>
              </Pressable>
              <View style={headerBalanceStyle}>
                {isBalanceVisible ? (
                  <>
                    <Typography.Header color="neutralBase+30" size="large" weight="semiBold">
                      {formatCurrency(account.data?.balance ?? 0)}
                    </Typography.Header>
                    <Typography.Text color="neutralBase+30" size="footnote" weight="regular">
                      {" " + (account.data?.currencyType ?? "SAR")}
                    </Typography.Text>
                  </>
                ) : (
                  <Typography.Text color="neutralBase+30" size="body" weight="regular">
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
              {sections?.length !== 0 ? (
                <>
                  {sections.map(section => {
                    if (section.type === "quick-actions") {
                      return <QuickActionsSection key={section.type} onViewAllPress={handleOnShortcutsPress} />;
                    }
                    if (section.type === "rewards") {
                      return <RewardsSection key={section.type} onViewAllPress={handleOnRewardsPress} />;
                    }
                    if (section.type === "articles") {
                      return <WhatsNextSection key={section.type} onViewAllPress={handleOnWhatsNextPress} />;
                    }
                    return <Fragment key={section.type} />;
                  })}
                  <View style={footerButtonStyle}>
                    <Button onPress={handleOnEditPress} variant="tertiary">
                      {t("Home.DashboardScreen.editDashboard")}
                    </Button>
                  </View>
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
