import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, View, ViewStyle } from "react-native";

import { BookmarkIcon, ChatIcon, InfoPolygonIcon, PhoneUnFilledIcon } from "@/assets/icons";
import { LinkList } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import InfoBox from "@/components/InfoBox";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useCallBank from "@/hooks/use-call-bank";
import useCallSupport, { PhoneBook } from "@/hooks/use-call-support";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { getItemFromEncryptedStorage } from "@/utils/encrypted-storage";

import { QuickActionLink } from "../components";

export default function HubScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { lookup, tryCall } = useCallSupport();
  const { tryCallBank, getBankNumber } = useCallBank();

  const handleSearchFAQPress = () => {
    navigation.navigate("FrequentlyAskedQuestions.FrequentlyAskedQuestionsStack");
  };

  const handleLiveChatPress = async () => {
    const ongoingChatParams = await getItemFromEncryptedStorage("hasOngoingLiveChat");
    if (ongoingChatParams) {
      navigation.navigate("HelpAndSupport.ChatScreen", {
        isOngoingChat: true,
        ...JSON.parse(ongoingChatParams),
      });
    } else {
      navigation.navigate("HelpAndSupport.LiveChatScreen");
    }
  };

  const handleCallUsPress = () => {
    tryCallBank();
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

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right"]}>
      <NavHeader variant="angled">
        <NavHeader.BoldTitle color="neutralBase-60">{t("HelpAndSupport.HubScreen.title")}</NavHeader.BoldTitle>
      </NavHeader>
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
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
            subText={getBankNumber?.data?.PhoneNumber}
            style={styles.quickActionLink}
          />
          <View style={emptyViewStyle} />
        </View>
        <LinkList
          onPress={handleOnReportFraudPress}
          icon={<InfoPolygonIcon />}
          iconColor="errorBase"
          linkTextEnd={lookup(PhoneBook.REPORT_FRAUD)}>
          {t("HelpAndSupport.HubScreen.reportFraud")}
        </LinkList>
        <InfoBox borderPosition="start" title={t("HelpAndSupport.HubScreen.infoBarMessage")} variant="success" />
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  quickActionLink: {
    flex: 1,
    height: "100%",
  },
});
