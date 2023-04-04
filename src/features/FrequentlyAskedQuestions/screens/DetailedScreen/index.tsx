import { RouteProp, useRoute } from "@react-navigation/native";
import { differenceInHours } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChatIcon, ChevronRightIcon, PhoneIcon, ThumbsDownIcon, ThumbsUpIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import {
  mockFeedbackFrequentlyAskedQuestions,
  mockRelatedFrequentlyAskedQuestions,
} from "@/mocks/frequentlyAskedQuestionsData";
import MainStackParams from "@/navigation/mainStackParams";
import { useThemeStyles } from "@/theme";

import HtmlWebView from "../../components/HtmlWebView";
import openLink from "../../components/utils/open-link";

export default function DetailedScreen() {
  const route = useRoute<RouteProp<MainStackParams, "FrequentlyAskedQuestions.DetailedScreen">>();
  const { t } = useTranslation();

  const { data, title } = route.params;
  const currentDate = new Date();

  const [feedbackState, setFeedbackState] = useState<"notResponded" | "positive" | "negative" | "helpRequested">(
    mockFeedbackFrequentlyAskedQuestions.vote === "UP" &&
      differenceInHours(currentDate, new Date(mockFeedbackFrequentlyAskedQuestions.updated_on)) < 24
      ? "positive"
      : mockFeedbackFrequentlyAskedQuestions.vote === "DOWN" &&
        differenceInHours(currentDate, new Date(mockFeedbackFrequentlyAskedQuestions.updated_on)) < 24
      ? "negative"
      : "notResponded"
  );

  const getFeedbackText = () => {
    return feedbackState === "notResponded"
      ? t("FrequentlyAskedQuestions.DetailedScreen.feedback")
      : feedbackState === "positive" || feedbackState === "helpRequested"
      ? t("FrequentlyAskedQuestions.DetailedScreen.postiveFeedback")
      : t("FrequentlyAskedQuestions.DetailedScreen.negativeFeedback");
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

  const inAppBrowserBackgroundColor = useThemeStyles<string>(theme => theme.palette["neutralBase-60"]);

  const inAppBrowserColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);

  return (
    <Page>
      <NavHeader title={title} />
      <ContentContainer isScrollView>
        <Typography.Text weight="semiBold" size="title1">
          {data.query}
        </Typography.Text>
        <View style={verticalStyle}>
          <HtmlWebView
            html={data.answer}
            onLinkPress={url => openLink(url, inAppBrowserBackgroundColor, inAppBrowserColor)}
          />
        </View>
        <View style={styles.row}>
          <Typography.Text size="callout" color="neutralBase-10">
            {getFeedbackText()}
          </Typography.Text>
          {feedbackState === "notResponded" ? (
            <View style={styles.row}>
              <Pressable
                onPress={() => {
                  setFeedbackState("positive");
                }}>
                <ThumbsUpIcon />
              </Pressable>
              <Pressable
                onPress={() => {
                  setFeedbackState("negative");
                }}>
                <ThumbsDownIcon />
              </Pressable>
            </View>
          ) : null}
        </View>
        <View style={sectionStyle}>
          <Typography.Text size="title3" weight="semiBold">
            {t("FrequentlyAskedQuestions.DetailedScreen.relatedQuestions")}
          </Typography.Text>
        </View>
        {mockRelatedFrequentlyAskedQuestions.map(relatedFAQdata => {
          return (
            <View key={relatedFAQdata.faq_id} style={verticalStyle}>
              <Stack direction="horizontal" align="center" justify="space-between">
                <Typography.Text size="callout">{relatedFAQdata.query}</Typography.Text>
                <ChevronRightIcon color={iconColor} />
              </Stack>
            </View>
          );
        })}
        {feedbackState === "negative" ? (
          <View style={sectionStyle}>
            <Typography.Text size="callout" weight="semiBold">
              {t("FrequentlyAskedQuestions.DetailedScreen.help")}
            </Typography.Text>
            <View style={styles.row}>
              <Pressable
                style={iconBoxStyle}
                onPress={() => {
                  setFeedbackState("helpRequested");
                }}>
                <PhoneIcon />
                <Typography.Text size="footnote">{t("FrequentlyAskedQuestions.DetailedScreen.call")}</Typography.Text>
              </Pressable>
              <Pressable
                style={iconBoxStyle}
                onPress={() => {
                  setFeedbackState("helpRequested");
                }}>
                <ChatIcon />
                <Typography.Text size="footnote">{t("FrequentlyAskedQuestions.DetailedScreen.chat")}</Typography.Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
