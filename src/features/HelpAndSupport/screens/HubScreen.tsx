import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { AccessTimeIcon, BookmarkIcon, ChatIcon, InfoIcon, PhoneUnFilledIcon } from "@/assets/icons";
import { LinkList } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useCallSupport, { PhoneBook } from "@/hooks/use-call-support";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { QuickActionLink } from "../components";

export default function HubScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { lookup, tryCall } = useCallSupport();

  const handleSearchFAQPress = () => {
    navigation.navigate("FrequentlyAskedQuestions.FrequentlyAskedQuestionsStack");
  };

  const handleLiveChatPress = () => {
    navigation.navigate("HelpAndSupport.LiveChatScreen");
  };

  const handleCallUsPress = () => {
    tryCall(PhoneBook.CALL_US);
  };

  const handleOnReportFraudPress = () => {
    tryCall(PhoneBook.REPORT_FRAUD);
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

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right"]}>
      <NavHeader variant="angled">
        <NavHeader.BoldTitle>{t("HelpAndSupport.HubScreen.title")}</NavHeader.BoldTitle>
      </NavHeader>
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
            subText={lookup(PhoneBook.CALL_US)}
            style={styles.quickActionLink}
          />
          <View style={emptyViewStyle} />
        </View>
        <LinkList
          onPress={handleOnReportFraudPress}
          icon={<InfoIcon />}
          iconColor="errorBase"
          linkTextEnd={lookup(PhoneBook.REPORT_FRAUD)}>
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
});
