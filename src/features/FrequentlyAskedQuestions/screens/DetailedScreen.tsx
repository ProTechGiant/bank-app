import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChatIcon, ChevronRightIcon, PhoneIcon, ThumbsDownIcon, ThumbsUpIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import HtmlWebView from "@/components/HtmlWebView/HtmlWebView";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useCallSupport, { PhoneBook } from "@/hooks/use-call-support";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import { useThemeStyles } from "@/theme";

import useOpenLink from "../../../hooks/use-open-link";
import { LoadingError } from "../components";
import { DOWN_VOTE, UP_VOTE } from "../constants";
import { useDetailsFAQ, useFeedback } from "../hooks/query-hooks";
import { FAQListItem } from "../types";

export default function DetailedScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "FrequentlyAskedQuestions.DetailedScreen">>();
  const openLink = useOpenLink();
  const { t, i18n } = useTranslation();
  const { faqId } = route.params as { faqId: string };

  const [showLoadingErrorModal, setShowLoadingErrorModal] = useState(false);
  const [feedbackState, setFeedbackState] = useState<typeof DOWN_VOTE | typeof UP_VOTE | null>(null);

  const { data, refetch, isError } = useDetailsFAQ(faqId, i18n.language);
  const updateFeedback = useFeedback(faqId, i18n.language);
  const { tryCall } = useCallSupport();

  useEffect(() => {
    setShowLoadingErrorModal(isError);
  }, [isError]);

  useEffect(() => {
    data && setFeedbackState(typeof data.Feedback === "object" ? null : data.Feedback);
  }, [data]);

  const handleOnFeedbackPress = async (vote: typeof DOWN_VOTE | typeof UP_VOTE) => {
    try {
      await updateFeedback.mutateAsync({
        ContentId: faqId,
        VoteId: vote,
      });
      setFeedbackState(vote);
    } catch (_) {}
  };

  const getFeedbackText = () => {
    return feedbackState === null
      ? t("FrequentlyAskedQuestions.DetailedScreen.feedback")
      : feedbackState === UP_VOTE
      ? t("FrequentlyAskedQuestions.DetailedScreen.positiveFeedback")
      : t("FrequentlyAskedQuestions.DetailedScreen.negativeFeedback");
  };

  const handleOnDismissErrorLoadingPress = () => {
    setShowLoadingErrorModal(false);
  };

  const handleOnRefreshErrorLoadingPress = () => {
    refetch();
    handleOnDismissErrorLoadingPress();
  };

  const handleOnCallPress = () => {
    tryCall(PhoneBook.CALL_US);
  };

  const handleOnChatPress = () => {
    navigation.navigate("HelpAndSupport.HelpAndSupportStack", { screen: "HelpAndSupport.LiveChatScreen" });
  };

  const sectionStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["48p"],
  }));

  const verticalStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const iconBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-50"],
    flex: 1,
    height: 70,
    justifyContent: "center",
    gap: theme.spacing["4p"],
    marginTop: theme.spacing["8p"],
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  return (
    <Page>
      <NavHeader />
      {undefined !== data ? (
        <ContentContainer isScrollView>
          <Typography.Text weight="semiBold" size="title1">
            {data.Query}
          </Typography.Text>
          <View style={verticalStyle}>
            <HtmlWebView html={data.Answer ?? ""} onLinkPress={url => openLink(url)} />
          </View>
          {data.Answer ? (
            <>
              <View style={verticalStyle}>
                <HtmlWebView html={data.Answer} onLinkPress={url => openLink(url)} />
                <View style={styles.row}>
                  <Typography.Text size="callout" color="neutralBase-10">
                    {getFeedbackText()}
                  </Typography.Text>
                  {feedbackState === null || feedbackState === UP_VOTE ? (
                    <View style={styles.row}>
                      <Pressable onPress={() => handleOnFeedbackPress(UP_VOTE)}>
                        <ThumbsUpIcon />
                      </Pressable>
                      <Pressable onPress={() => handleOnFeedbackPress(DOWN_VOTE)}>
                        <ThumbsDownIcon />
                      </Pressable>
                    </View>
                  ) : null}
                </View>
              </View>
              {data.RelatedFaqs?.length && (
                <View style={sectionStyle}>
                  <Typography.Text size="title3" weight="semiBold">
                    {t("FrequentlyAskedQuestions.DetailedScreen.relatedQuestions")}
                  </Typography.Text>
                </View>
              )}
              {data.RelatedFaqs?.length &&
                data.RelatedFaqs.map((faq: FAQListItem, index: number) => {
                  return (
                    <Pressable
                      key={index}
                      onPress={() => {
                        navigation.push("FrequentlyAskedQuestions.DetailedScreen", { faqId: faq.FaqId });
                      }}>
                      <View key={faq.FaqId} style={verticalStyle}>
                        <Stack direction="horizontal" align="center" justify="space-between">
                          <Typography.Text size="callout">{faq.Query}</Typography.Text>
                          <View style={styles.chevronContainer}>
                            <ChevronRightIcon color={iconColor} />
                          </View>
                        </Stack>
                      </View>
                    </Pressable>
                  );
                })}
              {feedbackState === DOWN_VOTE ? (
                <View style={sectionStyle}>
                  <Typography.Text size="callout" weight="semiBold">
                    {t("FrequentlyAskedQuestions.DetailedScreen.help")}
                  </Typography.Text>
                  <View style={styles.row}>
                    <Pressable style={iconBoxStyle} onPress={handleOnCallPress}>
                      <PhoneIcon />
                      <Typography.Text size="footnote">
                        {t("FrequentlyAskedQuestions.DetailedScreen.call")}
                      </Typography.Text>
                    </Pressable>
                    <Pressable style={iconBoxStyle} onPress={handleOnChatPress}>
                      <ChatIcon />
                      <Typography.Text size="footnote">
                        {t("FrequentlyAskedQuestions.DetailedScreen.chat")}
                      </Typography.Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}
            </>
          ) : null}
          {showLoadingErrorModal && (
            <LoadingError
              isVisible={showLoadingErrorModal}
              onClose={handleOnDismissErrorLoadingPress}
              onRefresh={handleOnRefreshErrorLoadingPress}
            />
          )}
        </ContentContainer>
      ) : (
        <FlexActivityIndicator />
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  chevronContainer: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
