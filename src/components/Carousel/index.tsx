import { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  GestureResponderEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";

import { palette, spacing } from "@/theme/values";

interface CarouselProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  onPressSlide?: (event: GestureResponderEvent) => void;
  Slide: React.ElementType;
  width?: number;
  pagination: boolean;
  loop?: boolean;
}

export default function Carousel({ pagination, data, onPressSlide, Slide, width, loop }: CarouselProps) {
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

    const minDistance = 0.4 < distance;

    if (roundIndex !== indexRef.current && !minDistance) {
      setIndex(roundIndex);
    }
  }, []);

  const onLoopScroll = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
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
        <View style={styles.overlayPagination}>
          {data.map((_, i) => {
            return (
              <View key={i} style={[styles.paginationDots, index === i ? styles.activeDot : styles.inactiveDot]} />
            );
          })}
        </View>
      </View>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function SlideRenderer({ item }: any) {
    return (
      <View style={{ width }}>
        <Slide data={item} onPress={onPressSlide} />
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
          snapToAlignment: "center",
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
    <View style={styles.container}>
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
        {...extraProps}
      />
      {pagination && <Pagination />}
    </View>
  );
}

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: palette["complimentBase"],
  },
  container: {
    paddingTop: spacing.small,
    position: "relative",
    width: "100%",
  },
  inactiveDot: {
    backgroundColor: palette["primaryBase-30"],
  },
  overlayPagination: {
    bottom: spacing.small,
    flexDirection: "row",
    position: "absolute",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  paginationDots: {
    borderRadius: 4,
    height: 8,
    marginBottom: spacing.small,
    marginHorizontal: 2,
    width: 8,
  },
});
