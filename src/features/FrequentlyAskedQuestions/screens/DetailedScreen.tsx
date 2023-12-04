import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import {
  ChatIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  FeedbackIcon,
  PhoneUnFilledIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import HtmlWebView from "@/components/HtmlWebView/HtmlWebView";
import InfoBox from "@/components/InfoBox";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useCallBank from "@/hooks/use-call-bank";
import useOpenLink from "@/hooks/use-open-link";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { DOWN_VOTE, UP_VOTE } from "../constants";
import { useDetailsFAQ, useFeedback } from "../hooks/query-hooks";
import { FAQListItem } from "../types";

export default function DetailedScreen() {
  const navigation = useNavigation();

  const {
    params: { faqId },
    name: routeName,
  } = useRoute<RouteProp<AuthenticatedStackParams, "FrequentlyAskedQuestions.DetailedScreen">>();
  const { t, i18n } = useTranslation();

  const openLink = useOpenLink();
  const { data, refetch, isError, isLoading } = useDetailsFAQ(faqId, i18n.language);
  const updateFeedback = useFeedback(faqId, i18n.language);
  const { tryCallBank } = useCallBank();

  const [showLoadingErrorModal, setShowLoadingErrorModal] = useState(false);
  const [feedbackState, setFeedbackState] = useState<typeof DOWN_VOTE | typeof UP_VOTE | undefined>(undefined);

  useEffect(() => {
    setShowLoadingErrorModal(isError);
  }, [isError]);

  useEffect(() => {
    if (updateFeedback.isError) {
      // waiting BO team to respond on us
    }
  }, [updateFeedback.isError]);

  useEffect(() => {
    if (data === undefined) return;
    setFeedbackState(data.Feedback.VoteId);
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
    return feedbackState === undefined
      ? t("FrequentlyAskedQuestions.DetailedScreen.feedback")
      : feedbackState === UP_VOTE
      ? t("FrequentlyAskedQuestions.DetailedScreen.positiveFeedback")
      : t("FrequentlyAskedQuestions.DetailedScreen.negativeFeedback");
  };

  const handleOnDismissErrorLoadingPress = () => {
    setShowLoadingErrorModal(false);
    navigation.goBack();
  };

  const handleOnRefreshErrorLoadingPress = () => {
    refetch();
    handleOnDismissErrorLoadingPress();
  };

  const handleOnCallPress = () => {
    tryCallBank();
  };

  const handleOnChatPress = () => {
    navigation.push("HelpAndSupport.HelpAndSupportStack", {
      screen: "HelpAndSupport.LiveChatScreen",
      params: {
        previousScreen: routeName,
        previousScreenParams: { faqId },
      },
    });
  };

  const sectionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["8p"],
  }));

  const verticalStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const iconBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    flex: 1,
    justifyContent: "flex-start",
    marginTop: theme.spacing["12p"],
    padding: theme.spacing["12p"],
    borderWidth: 1,
    borderRadius: theme.radii.medium,
    borderColor: theme.palette["neutralBase-30"],
  }));

  const feedbackContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderRadius: theme.radii.medium,
    borderColor: theme.palette["neutralBase-30"],
    padding: theme.spacing["24p"],
    marginVertical: theme.spacing["16p"],
  }));

  const feedbackButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderRadius: theme.radii.medium,
    borderColor: theme.palette["neutralBase-30"],
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["8p"],
    marginTop: theme.spacing["16p"],
    flexDirection: "row",
    justifyContent: "space-between",
    marginEnd: theme.spacing["16p"],
    alignItems: "center",
  }));

  const feedbackSubTitle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["4p"],
  }));

  const iconNameText = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);
  const contactsIconColor = useThemeStyles<string>(theme => theme.palette.complimentBase);
  const checkIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase+20"]);

  return (
    <Page>
      <NavHeader />
      {isLoading ? (
        <View style={styles.loading}>
          <FullScreenLoader />
        </View>
      ) : undefined !== data ? (
        <ContentContainer isScrollView>
          <Typography.Text weight="regular" size="title3">
            {data.Query}
          </Typography.Text>
          <View style={verticalStyle}>
            <HtmlWebView html={data.Answer} onLinkPress={url => openLink(url)} />
            {feedbackState === undefined ? (
              <View style={feedbackContainerStyle}>
                <Typography.Text size="callout" color="neutralBase+30" weight="medium">
                  {t("FrequentlyAskedQuestions.DetailedScreen.feedbackQuestion")}
                </Typography.Text>
                <Typography.Text size="callout" color="neutralBase" style={feedbackSubTitle}>
                  {t("FrequentlyAskedQuestions.DetailedScreen.feedbackQuestionHint")}
                </Typography.Text>
                <Stack direction="horizontal" align="center">
                  <Pressable style={feedbackButtonStyle} onPress={() => handleOnFeedbackPress(UP_VOTE)}>
                    <ThumbsUpIcon />
                    <Typography.Text size="footnote" color="neutralBase+30" weight="regular">
                      {"  "}
                      {t("FrequentlyAskedQuestions.DetailedScreen.yes")}
                    </Typography.Text>
                  </Pressable>
                  <Pressable style={feedbackButtonStyle} onPress={() => handleOnFeedbackPress(DOWN_VOTE)}>
                    <ThumbsDownIcon />
                    <Typography.Text size="footnote" color="neutralBase+30" weight="regular">
                      {"  "}
                      {t("FrequentlyAskedQuestions.DetailedScreen.no")}
                    </Typography.Text>
                  </Pressable>
                </Stack>
              </View>
            ) : (
              <InfoBox
                variant="primary"
                title={getFeedbackText()}
                icon={feedbackState === UP_VOTE ? <CheckCircleIcon color={checkIconColor} /> : <FeedbackIcon />}
              />
            )}
          </View>
          {undefined !== data.RelatedFaqs && data.RelatedFaqs?.length > 0 ? (
            <>
              <View style={sectionStyle}>
                <Typography.Text size="title3" weight="regular">
                  {t("FrequentlyAskedQuestions.DetailedScreen.relatedQuestions")}
                </Typography.Text>
              </View>
              {data.RelatedFaqs.map((faq: FAQListItem, index: number) => {
                return (
                  <Pressable
                    key={index}
                    onPress={() =>
                      navigation.navigate("FrequentlyAskedQuestions.DetailedScreen", { faqId: faq.FaqId })
                    }>
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
            </>
          ) : null}
          {feedbackState === DOWN_VOTE ? (
            <View style={sectionStyle}>
              <Typography.Text size="title3" weight="medium">
                {t("FrequentlyAskedQuestions.DetailedScreen.help")}
              </Typography.Text>
              <Stack direction="horizontal" gap="12p">
                <Pressable style={iconBoxStyle} onPress={handleOnCallPress}>
                  <PhoneUnFilledIcon color={contactsIconColor} />
                  <Typography.Text size="callout" style={iconNameText} weight="regular">
                    {t("FrequentlyAskedQuestions.DetailedScreen.call")}
                  </Typography.Text>
                </Pressable>
                <Pressable style={iconBoxStyle} onPress={handleOnChatPress}>
                  <ChatIcon color={contactsIconColor} />
                  <Typography.Text size="callout" style={iconNameText} weight="regular">
                    {t("FrequentlyAskedQuestions.DetailedScreen.chat")}
                  </Typography.Text>
                </Pressable>
              </Stack>
            </View>
          ) : null}
        </ContentContainer>
      ) : null}
      <LoadingErrorNotification
        isVisible={showLoadingErrorModal}
        onClose={handleOnDismissErrorLoadingPress}
        onRefresh={handleOnRefreshErrorLoadingPress}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  chevronContainer: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  loading: {
    flex: 1,
    marginTop: -49,
  },
});
