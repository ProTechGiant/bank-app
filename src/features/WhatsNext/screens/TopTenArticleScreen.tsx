import { RouteProp, useRoute } from "@react-navigation/native";
import { useRef, useState } from "react";
import { FlatList, FlatListProps, useWindowDimensions, View, ViewStyle } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";

import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import { useThemeStyles } from "@/theme";

import { TopTenSingleArticle } from "../components";
import { ArticleSectionType } from "../types";

export default function TopTenArticleScreen() {
  const { width } = useWindowDimensions();
  const [currentItem, setCurrentItem] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const flatListRef = useRef<Animated.FlatList<ArticleSectionType> & FlatList<ArticleSectionType>>(null);

  const topTenArticlesData = useRoute<RouteProp<AuthenticatedStackParams, "WhatsNext.TopTenArticleScreen">>().params
    .topTenArticlesData as ArticleSectionType;

  const scrollX = useSharedValue(0);

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
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    top: 75,
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <Page insets={["left", "right"]}>
      <Animated.FlatList
        ref={flatListRef}
        data={topTenArticlesData.ChildrenContents}
        renderItem={({ item }) => (
          <TopTenSingleArticle
            item={item}
            handleShowDetails={handleShowDetails}
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
      <View style={progressIndicatorContainerStyle}>
        <ProgressIndicator
          currentStep={currentItem}
          totalStep={topTenArticlesData.ChildrenContents?.length ?? 0}
          withBackButton={true}
          withEndStep={true}
        />
      </View>
    </Page>
  );
}
