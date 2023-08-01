import { Fragment, useEffect, useState } from "react";
import { Pressable, ScrollView, StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LoadingErrorNotification } from "@/components/LoadingError";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { ProfileIcon } from "../assets";
import HeaderSvg from "../assets/Header-homepage.svg";
import { BalanceCard, QuickActionsSection, RewardsSection, WhatsNextSection } from "../components";
import TasksPreviewer from "../components/TasksPreviewer";
import { useHomepageLayoutOrder } from "../contexts/HomepageLayoutOrderContext";
import { AccountMockedData, TasksMockData } from "../mocks/MockData";

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { sections, homepageLayout } = useHomepageLayoutOrder();

  const [layoutErrorIsVisible, setLayoutErrorIsVisible] = useState(false);

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
    // refetchAll();
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
          balance={AccountMockedData.balance}
          accountNumber={AccountMockedData.accountNumber}
          currency={AccountMockedData.currency}
        />
        <ScrollView contentContainerStyle={contentStyle} scrollEventThrottle={16}>
          <Stack align="stretch" direction="vertical" gap="32p">
            {TasksMockData.length > 0 ? <TasksPreviewer tasks={TasksMockData} /> : null}
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
