import { useCallback, useRef, useState } from "react";
import {
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
  onPressSlide: (event: GestureResponderEvent) => void;
  Slide: React.ElementType;
  width: number;
}

export default function Carousel({ data, onPressSlide, Slide, width }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);

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

  function Pagination() {
    return (
      <View style={styles.paginationContainer}>
        {data.map((_, i) => {
          return <View key={i} style={[styles.paginationDots, index === i ? styles.activeDot : styles.inactiveDot]} />;
        })}
      </View>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function SlideRenderer(item: any) {
    return (
      <View style={{ width }}>
        <Slide data={item} onPress={onPressSlide} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => {
          return SlideRenderer(item);
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        // scrollview to snap to the beginning of every slide
        pagingEnabled={true}
        // do not wait for the slides to render flatlist
        initialNumToRender={0}
        // slides rendered per batch 1 to speed up
        maxToRenderPerBatch={1}
        // scholl events triggered every 16ms while the user drags the carousel to prevent too many calculations
        scrollEventThrottle={16}
        // controls how many slides are mounted behind and infront of current. Here window is twice width of flatlist
        windowSize={2}
        // for react internal optimization
        keyExtractor={useCallback(e => e.action_id ?? e.id, [])}
      />
      <Pagination />
    </View>
  );
}

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: palette["complimentBase"],
  },
  container: {
    paddingVertical: spacing.small,
    width: "100%",
  },
  inactiveDot: {
    backgroundColor: palette["primaryBase-30"],
  },
  paginationContainer: {
    backgroundColor: palette["neutralBase-50"],
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: spacing.small,
  },
  paginationDots: {
    borderRadius: 4,
    height: 8,
    marginHorizontal: 2,
    marginVertical: spacing.small,
    width: 8,
  },
});
