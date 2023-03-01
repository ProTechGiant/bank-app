import { RouteProp, useRoute } from "@react-navigation/native";
import { differenceInHours } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View, ViewStyle } from "react-native";

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

export default function DetailedSceen() {
  const route = useRoute<RouteProp<MainStackParams, "FrequentlyAskedQuestions.DetailedScreen">>();
  const { data, title } = route.params;
  const { t } = useTranslation();
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

  const sectionStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["48p"],
  }));

  const questionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const horizontalStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const iconRowStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    gap: theme.spacing["12p"],
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

  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.faqSectionIcons);

  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  const getFeedbackText = () => {
    return feedbackState === "notResponded"
      ? t("FrequentlyAskedQuestions.DetailedSceen.feedback")
      : feedbackState === "positive" || feedbackState === "helpRequested"
      ? t("FrequentlyAskedQuestions.DetailedSceen.postiveFeedback")
      : t("FrequentlyAskedQuestions.DetailedSceen.negativeFeedback");
  };

  return (
    <Page>
      <NavHeader title={title} />
      <ScrollView alwaysBounceVertical={false}>
        <View style={horizontalStyle}>
          <Typography.Text weight="semiBold" size="title1">
            {data.query}
          </Typography.Text>
        </View>
        <ContentContainer>
          <Typography.Text size="callout">{data.answer}</Typography.Text>
        </ContentContainer>
        <View style={[horizontalStyle, { flexDirection: "row", justifyContent: "space-between" }]}>
          <Typography.Text size="callout" color="neutralBase-10">
            {getFeedbackText()}
          </Typography.Text>
          {feedbackState === "notResponded" && (
            <View style={{ flexDirection: "row" }}>
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
          )}
        </View>
        <View style={[sectionStyle, horizontalStyle]}>
          <Typography.Text size="title3" weight="semiBold">
            {t("FrequentlyAskedQuestions.DetailedSceen.relatedQuestions")}
          </Typography.Text>
        </View>
        {mockRelatedFrequentlyAskedQuestions.map(data => {
          return (
            <ContentContainer key={data.faq_id} style={{}}>
              <Stack direction="horizontal" align="center" justify="space-between">
                <Typography.Text size="callout">{data.query}</Typography.Text>
                <ChevronRightIcon height={iconDimensions} width={iconDimensions} color={iconColor} />
              </Stack>
            </ContentContainer>
          );
        })}
        {feedbackState === "negative" && (
          <ContentContainer style={sectionStyle}>
            <Typography.Text size="callout" weight="semiBold">
              {t("FrequentlyAskedQuestions.DetailedSceen.help")}
            </Typography.Text>
            <View style={iconRowStyle}>
              <Pressable
                style={iconBoxStyle}
                onPress={() => {
                  setFeedbackState("helpRequested");
                }}>
                <PhoneIcon />
                <Typography.Text size="footnote">{t("FrequentlyAskedQuestions.DetailedSceen.call")}</Typography.Text>
              </Pressable>
              <Pressable
                style={iconBoxStyle}
                onPress={() => {
                  setFeedbackState("helpRequested");
                }}>
                <ChatIcon />
                <Typography.Text size="footnote">{t("FrequentlyAskedQuestions.DetailedSceen.chat")}</Typography.Text>
              </Pressable>
            </View>
          </ContentContainer>
        )}
      </ScrollView>
    </Page>
  );
}
