import { RouteProp, useRoute } from "@react-navigation/native";
import { Alert, Image, ImageStyle, Platform, Share, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import ContentContainer from "@/components/ContentContainer";
import HtmlWebView from "@/components/HtmlWebView/HtmlWebView";
import { LoadingErrorPage } from "@/components/LoadingError";
import Stack from "@/components/Stack";
import Tag from "@/components/Tag";
import Typography from "@/components/Typography";
import openLink from "@/features/FrequentlyAskedQuestions/utils/open-link";
import useAppsFlyer from "@/hooks/use-appsflyer";
import { warn } from "@/logger";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import explorePlaceholder from "../assets/explore-placeholder.png";
import { AboutAuthorSection, EventDetailsSection, ExploreArticleHeader, FeedbackArticleSection } from "../components";
import { getWhatsNextTagColor } from "../utils";
import { WhatsNextMocks } from "../whatsNextMocks";

export default function ExploreArticleScreen() {
  // TODO: handle image dynamically when mock data allows for it
  const articleId = useRoute<RouteProp<MainStackParams, "WhatsNext.ExploreArticleScreen">>().params;
  const navigation = useNavigation();
  const appsFlyer = useAppsFlyer();

  // TODO get data from BE when ready using articleId from route params
  const data = WhatsNextMocks.find(data => data.ContentTag === "explore");

  const handleOnLoadingErrorRefresh = () => {
    //TODO: once we have backend
  };

  const handleOnArticleSharePress = async () => {
    try {
      const link = await appsFlyer.createLink("Article", {
        screen: "singleArticle",
        params: JSON.stringify({ articleId }),
      });
      await Share.share(Platform.OS === "ios" ? { url: link } : { message: link });
    } catch (error) {
      warn("appsflyer-sdk", "Could not generate Article link", JSON.stringify(error));
    }
  };

  const handleOnPositiveFeedbackPress = () => {
    //TODO handle feedback once BE is up
    Alert.alert("will handle positive feedback here");
  };

  const handleOnNegativeFeedbackPress = () => {
    //TODO handle feedback once BE is up
    Alert.alert("will handle negative feedback here");
  };

  const container = useThemeStyles<ViewStyle>(theme => ({
    flexGrow: 1,
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const imageStyle = useThemeStyles<ImageStyle>(theme => ({
    width: "100%",
    borderRadius: theme.radii.small,
    height: 250,
  }));

  const sectionStyle = useThemeStyles<ImageStyle>(theme => ({
    paddingVertical: theme.spacing["24p"],
  }));

  const inAppBrowserBackgroundColor = useThemeStyles<string>(theme => theme.palette["neutralBase-60"]);

  const inAppBrowserColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);

  return (
    <>
      {data !== undefined && data.ContentDescription && data.WhatsNextType ? (
        <ScrollView contentContainerStyle={container}>
          <ExploreArticleHeader handleOnArticleSharePress={handleOnArticleSharePress} />
          <ContentContainer>
            <Stack direction="vertical" gap="32p">
              <Tag variant={getWhatsNextTagColor(data.WhatsNextTypeId)} title={data.WhatsNextType} />
              <Typography.Text weight="medium" size="title1">
                {data.Title}
              </Typography.Text>
              <Typography.Text weight="medium" size="title3">
                {data.SubTitle}
              </Typography.Text>
              <Image source={explorePlaceholder} style={imageStyle} />
            </Stack>
            <HtmlWebView
              html={data.ContentDescription}
              onLinkPress={url => openLink(url, inAppBrowserBackgroundColor, inAppBrowserColor, navigation)}
            />
            {data.EventDetails ? (
              <View style={sectionStyle}>
                <EventDetailsSection data={data.EventDetails} />
              </View>
            ) : null}
            <View style={sectionStyle}>
              <FeedbackArticleSection
                onPositivePress={handleOnPositiveFeedbackPress}
                onNegativePress={handleOnNegativeFeedbackPress}
              />
            </View>
            {data.AuthorSocialMedia ? (
              <View style={sectionStyle}>
                <AboutAuthorSection
                  authorSocialMediaName={data.AuthorSocialMedia.Name}
                  authorDescription={data.AuthorAbout}
                  authorSocialMediaLink={data.AuthorSocialMedia.Link}
                />
              </View>
            ) : null}
          </ContentContainer>
        </ScrollView>
      ) : (
        <LoadingErrorPage onRefresh={handleOnLoadingErrorRefresh} />
      )}
    </>
  );
}
