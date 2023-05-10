import { RouteProp, useRoute } from "@react-navigation/native";
import { differenceInHours } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChatIcon, ChevronRightIcon, PhoneIcon, ThumbsDownIcon, ThumbsUpIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import HtmlWebView from "@/components/HtmlWebView/HtmlWebView";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import {
  mockFeedbackFrequentlyAskedQuestions,
  mockFrequentlyAskedQuestions,
  mockRelatedFrequentlyAskedQuestions,
} from "@/mocks/frequentlyAskedQuestionsData";
import MainStackParams from "@/navigation/mainStackParams";
import { useThemeStyles } from "@/theme";

import useOpenLink from "../../../hooks/use-open-link";
import { LoadingError } from "../components";
import { DetailedFaq } from "../types";

export default function DetailedScreen() {
  const route = useRoute<RouteProp<MainStackParams, "FrequentlyAskedQuestions.DetailedScreen">>();
  const openLink = useOpenLink();
  const { t } = useTranslation();
  const [title, setTitle] = useState<undefined | string>(undefined);
  const [data, setData] = useState<undefined | DetailedFaq>(undefined);
  const [showLoadingErrorModal, setShowLoadingErrorModal] = useState(false);

  const hasData = route.params as { data: DetailedFaq; title: string };
  const noData = route.params as { faqId: string };

  useEffect(() => {
    if (hasData.data) {
      setData(hasData.data);
      setTitle(hasData.title);
    } else if (noData.faqId) {
      mockFrequentlyAskedQuestions.categories.map(categories => {
        categories.sections.map(sections => {
          sections.section_faqs.map(sectionFaq => {
            if (sectionFaq.faq_id === noData.faqId) {
              setData(sectionFaq);
              setTitle(categories.category_name);
            }
          });
        });
      });
    }
  }, [hasData, noData]);

  useEffect(() => {
    if (data?.answer === undefined) {
      setShowLoadingErrorModal(true);
    }
  }, [data]);

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

  const handleOnDismissErrorLoadingPress = () => {
    setShowLoadingErrorModal(false);
  };

  const handleOnRefreshErrorLoadingPress = () => {
    //@TODO refetch API
    handleOnDismissErrorLoadingPress();
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
      <NavHeader title={title} />
      <ContentContainer isScrollView>
        <Typography.Text weight="semiBold" size="title1">
          {data?.query}
        </Typography.Text>
        {data?.answer ? (
          <>
            <View style={verticalStyle}>
              <HtmlWebView html={data.answer} onLinkPress={url => openLink(url)} />
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
                    <Typography.Text size="footnote">
                      {t("FrequentlyAskedQuestions.DetailedScreen.call")}
                    </Typography.Text>
                  </Pressable>
                  <Pressable
                    style={iconBoxStyle}
                    onPress={() => {
                      setFeedbackState("helpRequested");
                    }}>
                    <ChatIcon />
                    <Typography.Text size="footnote">
                      {t("FrequentlyAskedQuestions.DetailedScreen.chat")}
                    </Typography.Text>
                  </Pressable>
                </View>
              </View>
            ) : null}
          </>
        ) : (
          <LoadingError
            isVisible={showLoadingErrorModal}
            onClose={handleOnDismissErrorLoadingPress}
            onRefresh={handleOnRefreshErrorLoadingPress}
          />
        )}
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
