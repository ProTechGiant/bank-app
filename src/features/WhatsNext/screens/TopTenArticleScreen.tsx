import { RouteProp, useRoute } from "@react-navigation/native";
import { useRef, useState } from "react";
import {
  FlatList,
  FlatListProps,
  I18nManager,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";

import { ArrowLeftIcon } from "@/assets/icons";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { TopTenSingleArticle } from "../components";
import { ArticleSectionType } from "../types";

export default function TopTenArticleScreen() {
  const navigation = useNavigation();
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
    alignItems: "center",
    flexDirection: "row",
    zIndex: 1,
    position: "absolute",
    paddingTop: theme.spacing["48p"],
    paddingRight: theme.spacing["64p"],
    paddingLeft: theme.spacing["12p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase-30"]);

  return (
    <Page insets={["left", "right", "top"]}>
      <View style={progressIndicatorContainerStyle}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon color={iconColor} />
        </Pressable>
        <ProgressIndicator
          currentStep={currentItem}
          totalStep={topTenArticlesData?.ChildrenContents?.length ?? 0}
          withEndStep={true}
        />
      </View>
      <Animated.FlatList
        ref={flatListRef}
        data={topTenArticlesData.ChildrenContents ?? []}
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

const styles = StyleSheet.create({
  backButton: {
    transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }],
  },
});
