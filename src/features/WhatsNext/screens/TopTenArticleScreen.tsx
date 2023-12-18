import { RouteProp, useRoute } from "@react-navigation/native";
import { useRef, useState } from "react";
import { FlatList, FlatListProps, useWindowDimensions, View, ViewStyle } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";

import { Stack, Typography } from "@/components";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import { useThemeStyles } from "@/theme";

import { TopTenSingleArticle } from "../components";
import { ArticleSectionType } from "../types";
import { MAX_ARTICLES_IN_TOP_TEN } from "../utils";

export default function TopTenArticleScreen() {
  const { width } = useWindowDimensions();
  const { params } = useRoute<RouteProp<AuthenticatedStackParams, "WhatsNext.TopTenArticleScreen">>();

  const scrollX = useSharedValue(0);
  const [currentItem, setCurrentItem] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const flatListRef = useRef<Animated.FlatList<ArticleSectionType> & FlatList<ArticleSectionType>>(null);
  const topTenArticlesData = params.topTenArticlesData;

  const handleOnScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleOnViewableItemsChanged = useRef<FlatListProps<ArticleSectionType>["onViewableItemsChanged"]>(
    ({ viewableItems }) => {
      setCurrentItem((viewableItems[0].index ?? 0) + 1);
    }
  ).current;

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleOnBack = () => {
    const index = currentItem - 2;
    if (index < 0) {
      return;
    }

    flatListRef?.current?.scrollToOffset({
      offset: width * index,
      animated: true,
    });
  };

  const handleOnNext = () => {
    const index = currentItem;
    if (topTenArticlesData.ChildrenContents === undefined || index === topTenArticlesData.ChildrenContents.length) {
      return;
    }

    flatListRef?.current?.scrollToOffset({
      offset: width * index,
      animated: true,
    });
  };

  const progressIndicatorContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    zIndex: 1,
    position: "absolute",
    paddingTop: theme.spacing["48p"],
    width: "100%",
  }));

  const progressBarStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["12p"],
    width: "100%",
  }));

  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  return (
    <Page insets={["left", "right"]}>
      <View style={progressIndicatorContainerStyle}>
        <NavHeader
          variant="white"
          withBackButton
          backgroundAngledColor={NavHeaderColor}
          title={
            <Stack direction="horizontal" align="center">
              <View style={progressBarStyle}>
                <ProgressIndicator
                  currentStep={currentItem}
                  totalStep={
                    topTenArticlesData?.ChildrenContents?.length > MAX_ARTICLES_IN_TOP_TEN
                      ? MAX_ARTICLES_IN_TOP_TEN
                      : topTenArticlesData?.ChildrenContents?.length ?? 0
                  }
                />
              </View>
              <Typography.Text>
                {currentItem}/
                {topTenArticlesData?.ChildrenContents?.length > MAX_ARTICLES_IN_TOP_TEN
                  ? MAX_ARTICLES_IN_TOP_TEN
                  : topTenArticlesData?.ChildrenContents?.length ?? 0}
              </Typography.Text>
            </Stack>
          }
          end={
            <Typography.Text color="primaryBase-70" size="caption2" weight="medium">
              {`${currentItem} / ${topTenArticlesData?.ChildrenContents?.length}`}
            </Typography.Text>
          }
        />
      </View>
      <Animated.FlatList
        ref={flatListRef}
        data={
          topTenArticlesData.ChildrenContents?.length > MAX_ARTICLES_IN_TOP_TEN
            ? topTenArticlesData.ChildrenContents.slice(0, MAX_ARTICLES_IN_TOP_TEN)
            : topTenArticlesData.ChildrenContents ?? []
        }
        renderItem={({ item }) => (
          <TopTenSingleArticle
            item={item}
            onShowDetails={handleShowDetails}
            showDetails={showDetails}
            onBackPress={handleOnBack}
            onNextPress={handleOnNext}
          />
        )}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={handleOnScroll}
        onViewableItemsChanged={handleOnViewableItemsChanged}
      />
    </Page>
  );
}
