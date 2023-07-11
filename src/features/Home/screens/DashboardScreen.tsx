import Clipboard from "@react-native-clipboard/clipboard";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StatusBar, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
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
  const addToast = useToasts();

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isNotificationsExpanded, setIsNotificationsExpanded] = useState(false);
  const [layoutErrorIsVisible, setLayoutErrorIsVisible] = useState(false);
  const [headerShrinkStatus, setHeaderShrinkStatus] = useState(false);
  const isNotificationsExpandedSharedValue = useSharedValue(false);
  const headerShrinkStatusSharedValue = useSharedValue(false);
  const headerHeight = useSharedValue(305);
  const accountBalanceFont = useSharedValue(42);
  const currencyFont = useSharedValue(16);

  useEffect(() => {
    if (homepageLayout?.isError === true) {
      setLayoutErrorIsVisible(true);
    }
  }, [homepageLayout]);

  const handleScroll = useAnimatedScrollHandler(event => {
    if (isNotificationsExpandedSharedValue.value) isNotificationsExpandedSharedValue.value = false;
    const offsetY = Math.abs(event.contentOffset.y);
    const headerHeightUpdatedValue = offsetY > 0 ? 180 : 305;
    const accountBalanceFontValue = offsetY > 0 ? 18 : 42;
    const currencyFontValue = offsetY > 0 ? 16 : 16;
    if (offsetY !== 0 && !headerShrinkStatusSharedValue.value) headerShrinkStatusSharedValue.value = true;
    else if (offsetY === 0 && headerShrinkStatusSharedValue.value) headerShrinkStatusSharedValue.value = false;
    headerHeight.value = withSpring(headerHeightUpdatedValue);
    currencyFont.value = withSpring(currencyFontValue);
    accountBalanceFont.value = withSpring(accountBalanceFontValue);
  });

  const updateNotificationsExpanded = useCallback((newValue: boolean) => setIsNotificationsExpanded(newValue), []);
  const updateheaderShrinkStatus = useCallback((newValue: boolean) => setHeaderShrinkStatus(newValue), []);

  useAnimatedReaction(
    () => isNotificationsExpandedSharedValue.value,
    value => runOnJS(updateNotificationsExpanded)(value),
    [isNotificationsExpandedSharedValue.value]
  );

  useAnimatedReaction(
    () => headerShrinkStatusSharedValue.value,
    value => runOnJS(updateheaderShrinkStatus)(value),
    [headerShrinkStatusSharedValue.value]
  );

  const handleOnIbanCopyPress = () => {
    if (undefined === account.data?.iban) return;
    Clipboard.setString(account.data.iban);

    addToast({ variant: "confirm", message: t("Home.DashboardScreen.ibanCopied") });
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

  const onExpandCollapsPress = (value: boolean) => {
    headerHeight.value = withSpring(
      headerShrinkStatusSharedValue.value
        ? isNotificationsExpandedSharedValue.value
          ? 180
          : 305
        : isNotificationsExpandedSharedValue.value
        ? 305
        : 475
    );
    isNotificationsExpandedSharedValue.value = value;
  };

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingTop: theme.spacing["12p"],
    paddingBottom: theme.spacing["12p"],
    overflow: "hidden",
  }));

  const headerBalanceStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "baseline",
      flexDirection: "row",
      paddingTop: !headerShrinkStatus ? theme.spacing["24p"] : 0,
    }),
    [headerShrinkStatus]
  );

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

  const accountBalanceTextStyle = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette["neutralBase+30"],
      fontWeight: theme.typography.text.weights.semiBold,
      marginBottom: headerShrinkStatus ? theme.spacing["8p"] : 0,
    }),
    [headerShrinkStatus]
  );

  const currencyTextStyle = useThemeStyles<TextStyle>(
    theme => ({
      color: theme.palette["neutralBase+30"],
      fontWeight: theme.typography.text.weights.regular,
      marginBottom: headerShrinkStatus ? theme.spacing["8p"] : 0,
    }),
    [headerShrinkStatus]
  );

  const animatedhearderHeightStyles = useAnimatedStyle(() => {
    return {
      height: headerHeight.value,
    };
  });

  const animatedaccountBalanceFontStyles = useAnimatedStyle(() => {
    return {
      fontSize: accountBalanceFont.value,
    };
  });

  const animatedcurrencyFontStyles = useAnimatedStyle(() => {
    return {
      height: currencyFont.value,
    };
  });

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Animated.View style={[styles.backgroundImage, animatedhearderHeightStyles]}>
        {headerShrinkStatus ? (
          <BackgroundCollapsedSvg />
        ) : isNotificationsExpanded ? (
          <BackgroundExpandedSvg />
        ) : (
          <BackgroundCollapsedSvg />
        )}
      </Animated.View>
      <SafeAreaView edges={["top"]} style={styles.container}>
        <Animated.View style={[headerStyle, animatedhearderHeightStyles]}>
          <View style={styles.headerCentered}>
            <Typography.Text color="neutralBase+30" size="footnote" weight="medium" style={styles.headerText}>
              {account.data?.name ?? "-"}
            </Typography.Text>
            {!headerShrinkStatus && (
              <Pressable onPress={handleOnIbanCopyPress}>
                <Typography.Text color="neutralBase+30" size="footnote" weight="medium" style={styles.headerText}>
                  {account.data?.iban ?? "-"}
                </Typography.Text>
              </Pressable>
            )}
            <View style={headerBalanceStyle}>
              {isBalanceVisible ? (
                <>
                  <Animated.Text style={[accountBalanceTextStyle, animatedaccountBalanceFontStyles]}>
                    {formatCurrency(account.data?.balance ?? 0)}
                  </Animated.Text>
                  <Animated.Text style={[currencyTextStyle, animatedcurrencyFontStyles]}>
                    {" " + (account.data?.currencyType ?? "SAR")}
                  </Animated.Text>
                </>
              ) : (
                <Typography.Text color="neutralBase+30" size="body" weight="regular">
                  {t("Home.DashboardScreen.balanceHidden")}
                </Typography.Text>
              )}
            </View>
            {!headerShrinkStatus && (
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
            )}
          </View>
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
        </Animated.View>
        <Animated.ScrollView contentContainerStyle={contentStyle} scrollEventThrottle={16} onScroll={handleScroll}>
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
        </Animated.ScrollView>
      </SafeAreaView>
    </Page>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
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
