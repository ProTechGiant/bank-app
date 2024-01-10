import { useNetInfo } from "@react-native-community/netinfo";
import { RouteProp, StackActions, useRoute } from "@react-navigation/native";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ImageStyle, Platform, RefreshControl, Share, StatusBar, View } from "react-native";
import { useQueryClient } from "react-query";

import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import HtmlWebView from "@/components/HtmlWebView/HtmlWebView";
import LoadingErrorNotification from "@/components/LoadingError/LoadingErrorNotification";
import NetworkImage from "@/components/NetworkImage";
import Page from "@/components/Page";
import PlaceholderImage from "@/components/PlaceholderImage";
import Stack from "@/components/Stack";
import Tag from "@/components/Tag";
import Typography from "@/components/Typography";
import useAppsFlyer from "@/hooks/use-appsflyer";
import { useContentArticle, useContentFeedback } from "@/hooks/use-content";
import useOpenLink from "@/hooks/use-open-link";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import {
  AboutAuthorSection,
  EventDetailsSection,
  ExploreArticleHeader,
  FeedbackArticleSection,
  RelatedSection,
} from "../components";
import { DOWN_VOTE, UP_VOTE } from "../constants";
import { ArticleSectionType } from "../types";
import { getWhatsNextTagColor } from "../utils";

export default function ExploreArticleScreen() {
  const articleId = useRoute<RouteProp<AuthenticatedStackParams, "WhatsNext.ExploreArticleScreen">>().params.articleId;
  const openLink = useOpenLink();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const appsFlyer = useAppsFlyer();
  const { isConnected } = useNetInfo();

  const { data: whatsNextSingleArticle, refetch, isLoading, isFetching } = useContentArticle(articleId);

  const singleArticleData = whatsNextSingleArticle?.SingleArticle;
  const relatedArticles = whatsNextSingleArticle?.RelatedArticles || [];
  const feedback = whatsNextSingleArticle?.Feedback;
  const queryClient = useQueryClient();
  const [isLoadingErrorModalVisible, setIsLoadingErrorModalVisible] = useState<boolean>(false);

  const updateArticleFeedback = useContentFeedback(
    isEmpty(feedback) ? "POST" : "PUT",
    singleArticleData?.ContentId ?? ""
  );
  const onRefresh = () => {
    queryClient.clear();
    refetch();
  };

  const handleOnArticleSharePress = async () => {
    try {
      const url = await appsFlyer.createLink("Article", {
        internalUrl: `croatia://whats-next/${articleId}`,
      });
      await Share.share(Platform.OS === "ios" ? { url } : { message: url });
    } catch (error) {
      warn("explore-article-screen", "Could not generate Article link", JSON.stringify(error));
    }
  };

  const handleOnFeedbackPress = async (vote: string) => {
    try {
      await updateArticleFeedback.mutateAsync({
        ContentId: singleArticleData?.ParentContentId ?? "",
        VoteId: feedback?.VoteId === vote ? null : vote,
      });
      refetch();
    } catch (error) {
      Alert.alert(t("WhatsNext.ExploreArticleScreen.feedbackError"));
      warn("ERROR", "Could not update feedback", JSON.stringify(error));
    }
  };

  const handleOnRelatedArticlePress = (relatedArticleId: string) => {
    navigation.dispatch(
      StackActions.push("WhatsNext.ExploreArticleScreen", {
        articleId: relatedArticleId,
      })
    );
  };

  useEffect(() => {
    if (!isConnected) {
      setIsLoadingErrorModalVisible(true);
    }
  }, [isConnected]);

  const imageStyle = useThemeStyles<ImageStyle>(theme => ({
    width: "100%",
    borderRadius: theme.radii.small,
    height: 250,
  }));

  const sectionStyle = useThemeStyles<ImageStyle>(theme => ({
    paddingVertical: theme.spacing["24p"],
  }));

  const contentStyle = useThemeStyles<ImageStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const handleonRefreshButtonPress = () => {
    setIsLoadingErrorModalVisible(false);
    refetch();
  };

  return (
    <Page insets={["bottom", "left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {singleArticleData !== undefined && relatedArticles !== undefined && feedback !== undefined ? (
        <ContentContainer
          isScrollView
          hasHorizontalPadding={false}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={onRefresh} />}>
          <ExploreArticleHeader
            handleOnArticleSharePress={handleOnArticleSharePress}
            imageURL={singleArticleData.Media[0].SourceFileURL}
          />
          {/* <CustomStatusBar barStyle="light-content" /> */}
          <View style={contentStyle}>
            <Stack direction="vertical" gap="32p">
              <Tag
                variant={getWhatsNextTagColor(singleArticleData.WhatsNextTypeId)}
                title={singleArticleData.WhatsNextType}
              />
              <Typography.Text weight="medium" size="title1">
                {singleArticleData.Title}
              </Typography.Text>
              <Typography.Text weight="medium" size="title3">
                {singleArticleData.SubTitle}
              </Typography.Text>
              {singleArticleData.Media[0].SourceFileURL ? (
                <NetworkImage style={imageStyle} source={{ uri: singleArticleData.Media[0].SourceFileURL }} />
              ) : (
                <PlaceholderImage style={imageStyle} />
              )}
            </Stack>
            <HtmlWebView html={singleArticleData.ContentDescription} onLinkPress={url => openLink(url)} />
            {singleArticleData.EventDetails ? (
              <View style={sectionStyle}>
                <EventDetailsSection
                  data={singleArticleData.EventDetails}
                  rewardsLink={singleArticleData.RewardsLink}
                />
              </View>
            ) : null}
            <View style={sectionStyle}>
              <FeedbackArticleSection
                feedback={feedback}
                onPositivePress={() => handleOnFeedbackPress(UP_VOTE)}
                onNegativePress={() => handleOnFeedbackPress(DOWN_VOTE)}
              />
            </View>
            {singleArticleData.AuthorSocialMedia ? (
              <View style={sectionStyle}>
                <AboutAuthorSection
                  authorImageURL={singleArticleData.AuthorImage}
                  authorSocialMediaName={singleArticleData.AuthorSocialMedia.Name}
                  authorDescription={singleArticleData.AuthorAbout}
                  authorSocialMediaLink={singleArticleData.AuthorSocialMedia.Link}
                />
              </View>
            ) : null}
            {relatedArticles.length > 0 ? (
              <RelatedSection
                data={relatedArticles as ArticleSectionType[]}
                onArticlePress={relatedArticleId => {
                  handleOnRelatedArticlePress(relatedArticleId);
                }}
              />
            ) : null}
          </View>
        </ContentContainer>
      ) : isLoading ? (
        <FlexActivityIndicator color="primaryBase" size="large" />
      ) : (
        <LoadingErrorNotification
          isVisible={isLoadingErrorModalVisible}
          onClose={() => setIsLoadingErrorModalVisible(false)}
          onRefresh={handleonRefreshButtonPress}
        />
      )}
    </Page>
  );
}
