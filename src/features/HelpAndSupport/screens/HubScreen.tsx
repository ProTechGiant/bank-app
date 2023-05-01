import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";
import { Alert, Linking, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AccessTimeIcon, BookmarkIcon, ChatIcon, InfoIcon, PhoneUnFilledIcon } from "@/assets/icons";
import { LinkList } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { mockHelpAndSupport } from "@/mocks/helpAndSupportData";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { QuickActionLink } from "../components";
import { CALL_US, REPORT_FRAUD } from "../constants";

export default function HubScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const statusBarHeight = useSafeAreaInsets().top;

  const handleSearchFAQPress = () => {
    navigation.navigate("FrequentlyAskedQuestions.FrequentlyAskedQuestionsStack");
  };

  const handleLiveChatPress = () => {
    navigation.navigate("HelpAndSupport.LiveChatScreen");
  };

  const handleCallUsPress = () => {
    const phoneNumber =
      mockHelpAndSupport.ChildrenContents.find(item => item.ContentTag === CALL_US)?.ContentDescription ?? "";

    makeTheCall(phoneNumber);
  };

  const handleOnReportFraudPress = () => {
    const phoneNumber =
      mockHelpAndSupport.ChildrenContents.find(item => item.ContentTag === REPORT_FRAUD)?.ContentDescription ?? "";

    makeTheCall(phoneNumber);
  };

  const makeTheCall = (phoneNumber: string) => {
    Alert.alert(phoneNumber, undefined, [
      {
        text: t("HelpAndSupport.HubScreen.cancel"),
      },
      {
        text: t("HelpAndSupport.HubScreen.call"),
        onPress: async () => {
          try {
            const canMakeTheCall = await Linking.canOpenURL(`tel:${phoneNumber}`);
            if (canMakeTheCall) {
              Linking.openURL(`tel:${phoneNumber}`);
            } else {
              Clipboard.setString(phoneNumber);
              Alert.alert(t("HelpAndSupport.HubScreen.callError"));
            }
          } catch (error) {
            Clipboard.setString(phoneNumber);
            Alert.alert(t("HelpAndSupport.HubScreen.callError"));
          }
        },
      },
    ]);
  };

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing["12p"],
  }));

  const helpQuestionTextStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["12p"],
  }));

  const quickActionsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["12p"],
    flexDirection: "row",
    alignItems: "flex-start",
  }));

  const emptyViewStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["12p"],
    flex: 1,
    height: "100%",
  }));

  const infoBannerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radii.small,
    padding: theme.spacing["20p"],
    gap: theme.spacing["16p"],
  }));

  const navHeaderContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    marginTop: -statusBarHeight,
    paddingTop: statusBarHeight,
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <View style={navHeaderContainerStyle}>
        <NavHeader
          children={
            <Typography.Text weight="medium" size="title1" style={styles?.title}>
              {t("HelpAndSupport.HubScreen.title")}
            </Typography.Text>
          }
        />
      </View>
      <ContentContainer isScrollView style={contentContainerStyle}>
        <Typography.Text weight="medium" size="callout" color="neutralBase+30" style={helpQuestionTextStyle}>
          {t("HelpAndSupport.HubScreen.helpQuestion")}
        </Typography.Text>
        <View style={quickActionsContainerStyle}>
          <QuickActionLink
            onPress={handleSearchFAQPress}
            icon={<BookmarkIcon />}
            text={t("HelpAndSupport.HubScreen.searchFAQ")}
            style={styles.quickActionLink}
          />
          <QuickActionLink
            onPress={handleLiveChatPress}
            icon={<ChatIcon />}
            topText={t("HelpAndSupport.HubScreen.twentyFourSeven")}
            text={t("HelpAndSupport.HubScreen.liveChat")}
            style={styles.quickActionLink}
          />
        </View>
        <View style={quickActionsContainerStyle}>
          <QuickActionLink
            onPress={handleCallUsPress}
            icon={<PhoneUnFilledIcon />}
            topText={t("HelpAndSupport.HubScreen.twentyFourSeven")}
            text={t("HelpAndSupport.HubScreen.callUs")}
            subText={mockHelpAndSupport.ChildrenContents.find(item => item.ContentTag === CALL_US)?.ContentDescription}
            style={styles.quickActionLink}
          />
          <View style={emptyViewStyle} />
        </View>
        <LinkList
          onPress={handleOnReportFraudPress}
          icon={<InfoIcon />}
          iconColor="errorBase"
          linkTextEnd={
            mockHelpAndSupport.ChildrenContents.find(item => item.ContentTag === REPORT_FRAUD)?.ContentDescription
          }>
          {t("HelpAndSupport.HubScreen.reportFraud")}
        </LinkList>
        <View style={infoBannerStyle}>
          <AccessTimeIcon />
          <Typography.Text size="caption1" color="neutralBase" style={styles.infoBarMessage}>
            {t("HelpAndSupport.HubScreen.infoBarMessage")}
          </Typography.Text>
        </View>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  infoBarMessage: {
    alignSelf: "center",
    flex: 1,
    textAlign: "center",
  },
  quickActionLink: {
    flex: 1,
    height: "100%",
  },
  title: {
    marginBottom: 15,
    marginTop: 14,
  },
});
