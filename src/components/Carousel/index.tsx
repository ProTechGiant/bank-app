import { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { useThemeStyles } from "@/theme";

interface CarouselProps<T> {
  data: T[];
  Slide: React.ElementType;
  width?: number;
  pagination?: "overlay" | "under";
  loop?: boolean;
}

export function Carousel<T>({ pagination, data, Slide, width, loop }: CarouselProps<T>) {
  const activeDotStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette.complimentBase,
      height: 8,
      width: 8,
    }),
    []
  );
  const inactiveDotStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["primaryBase-30"],
      height: 6,
      width: 6,
    }),
    []
  );
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      paddingTop: theme.spacing["8p"],
      width: "100%",
      position: "relative",
    }),
    []
  );
  const overlayPaginationStyle = useThemeStyles<ViewStyle>(
    theme => ({
      bottom: theme.spacing["8p"],
      position: "absolute",
      flexDirection: "row",
    }),
    []
  );
  const underPaginationStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      paddingBottom: theme.spacing["16p"],
    }),
    []
  );
  const paginationDotsStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderRadius: 4,
      marginHorizontal: 2,
      marginBottom: theme.spacing["8p"],
      alignSelf: "center",
    }),
    []
  );

  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);
  const flatListRef = useRef<FlatList>(null);
  const offset = 20;
  const avaliableWidth = width ? width : Dimensions.get("screen").width;

  indexRef.current = index;
  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);

    const distance = Math.abs(roundIndex - index);

    const minDistance = distance > 0.4;

    if (roundIndex !== indexRef.current && !minDistance) {
      setIndex(roundIndex);
    }
  }, []);

  const onLoopScroll = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: {
    layoutMeasurement: { width: number; height: number };
    contentOffset: { x: number; y: number };
    contentSize: { width: number; height: number };
  }) => {
    if (data.length <= 1) {
      return;
    }
    if (contentOffset.x <= offset + avaliableWidth) {
      flatListRef?.current?.scrollToIndex({ index: data.length / 2 + 1, animated: false });
    }
    if (layoutMeasurement.width + contentOffset.x >= contentSize.width - (offset + avaliableWidth)) {
      flatListRef?.current?.scrollToIndex({ index: data.length / 2, animated: false });
    }
  };

  function Pagination() {
    return (
      <View style={styles.paginationContainer}>
        <View style={pagination === "overlay" ? overlayPaginationStyle : underPaginationStyle}>
          {data.map((_, i) => {
            return <View key={i} style={[paginationDotsStyle, index === i ? activeDotStyle : inactiveDotStyle]} />;
          })}
        </View>
      </View>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function SlideRenderer({ item }: any) {
    return (
      <View style={{ width }}>
        <Slide data={item} />
      </View>
    );
  }

  const extraProps =
    loop === true
      ? {
          onScroll: ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => onLoopScroll(nativeEvent),
          ref: flatListRef,
          contentContainerStyle: {
            marginLeft:
              Dimensions.get("screen").width !== avaliableWidth && width
                ? (Dimensions.get("screen").width - width) / 2
                : 0,
            marginRight:
              Dimensions.get("screen").width !== avaliableWidth && width
                ? (Dimensions.get("screen").width - width) / 2
                : 0,
          },
          initialScrollIndex: data.length > 1 ? data.length / 2 + 1 : 0,
          snapToInterval: avaliableWidth + 3,
          decelerationRate: 0,
          initialNumToRender: data.length,
          maxToRenderPerBatch: data.length,
          onScrollToIndexFailed: (info: {
            index: number;
            highestMeasuredFrameIndex: number;
            averageItemLength: number;
          }) => {
            const wait = new Promise(resolve => setTimeout(resolve, 5000));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
            });
          },
        }
      : {
          onScroll: onScroll,
        };

  return (
    <View style={container}>
      <FlatList
        data={data}
        renderItem={SlideRenderer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        // scrollview to snap to the beginning of every slide
        pagingEnabled={true}
        // event triggered every 16ms while the user drags the carousel to prevent too many calculations
        scrollEventThrottle={16}
        // for react internal optimization
        keyExtractor={(item, index) => `key ${index}`}
        showsVerticalScrollIndicator={false}
        snapToAlignment="center"
        {...extraProps}
      />
      {pagination && <Pagination />}
    </View>
  );
}

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
