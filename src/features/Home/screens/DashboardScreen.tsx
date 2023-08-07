import { Fragment, useEffect, useState } from "react";
import { Pressable, ScrollView, StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LoadingErrorNotification } from "@/components/LoadingError";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { useCurrentAccount } from "@/hooks/use-accounts";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { ProfileIcon } from "../assets";
import HeaderSvg from "../assets/Header-homepage.svg";
import { BalanceCard, QuickActionsSection, RewardsSection, TasksPreviewer, WhatsNextSection } from "../components";
import { useHomepageLayoutOrder } from "../contexts/HomepageLayoutOrderContext";
import { useRefetchHomepageLayout, useTasks } from "../hooks/query-hooks";

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { sections, homepageLayout } = useHomepageLayoutOrder();

  const [layoutErrorIsVisible, setLayoutErrorIsVisible] = useState(false);
  const { data: tasks } = useTasks();
  const { refetchAll } = useRefetchHomepageLayout();
  const account = useCurrentAccount();

  useEffect(() => {
    if (homepageLayout?.isError === true) {
      setLayoutErrorIsVisible(true);
    }
  }, [homepageLayout]);

  const handleOnEditLayoutPress = () => {
    navigation.navigate("Home.SectionsReordererModal");
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
          balance={account.data?.balance}
          accountNumber={account.data?.id}
          currency={account.data?.currencyType}
        />
        <ScrollView contentContainerStyle={contentStyle} scrollEventThrottle={16}>
          <Stack align="stretch" direction="vertical" gap="32p">
            {tasks?.length > 0 ? <TasksPreviewer tasks={tasks} /> : null}
            {sections?.length !== 0 ? (
              <>
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
