import { useRef, useState } from "react";
import { FlatListProps, View, ViewStyle } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";

import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import { useThemeStyles } from "@/theme";

import { TopTenSingleArticle } from "../components";
import { ArticleSectionType } from "../types";
import { WhatsNextMocks } from "../whatsNextMocks";

export default function TopTenArticleScreen() {
  const [currentItem, setCurrentItem] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const topTenArticlesData = WhatsNextMocks.find(data => data?.ContentTag === "Top 10") as ArticleSectionType;

  const scrollX = useSharedValue(0);

  const handleOnScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    },
  });
  const handleOnViewableItemsChanged = useRef<FlatListProps<ArticleSectionType>["onViewableItemsChanged"]>(
    ({ viewableItems }) => {
      setCurrentItem(viewableItems[0].item.ContentId);
    }
  ).current;

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
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
        data={topTenArticlesData.ChildrenContents}
        renderItem={({ item }) => (
          <TopTenSingleArticle item={item} handleShowDetails={handleShowDetails} showDetails={showDetails} />
        )}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={handleOnScroll}
        onViewableItemsChanged={handleOnViewableItemsChanged}
      />
      <View style={progressIndicatorContainerStyle}>
        <ProgressIndicator currentStep={currentItem} totalStep={10} withBackButton={true} withEndStep={true} />
      </View>
    </Page>
  );
}
