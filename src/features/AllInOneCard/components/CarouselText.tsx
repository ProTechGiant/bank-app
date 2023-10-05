import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

import Typography from "@/components/Typography";

const { width: screenWidth } = Dimensions.get("window");

interface CarouselTextProps {
  data: {
    img: JSX.Element;
    title: string;
    description: string;
    id: number;
  }[];
}

export default function CarouselText({ data }: CarouselTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [firstStart, setFirstStart] = useState(true);

  useEffect(() => {
    const nextIndex = (currentIndex + 1) % data.length;
    let isMounted = true;

    const startAnimations = () => {
      if (nextIndex === 0) {
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: (data.length - 1) * screenWidth,
            duration: 1300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          translateX.setValue(0); // Reset translateX
          setCurrentIndex(nextIndex);
        });
      } else {
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: -screenWidth,
            duration: 1300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          translateX.setValue(0); // Reset translateX
          if (isMounted) {
            setCurrentIndex(nextIndex);
          }
        });
      }
    };

    if (firstStart) {
      // If it's the first start, apply an initial delay
      Animated.delay(1150).start(startAnimations);
      setFirstStart(false); // Set firstStart to false after the first run
    } else {
      startAnimations();
    }
    return () => {
      isMounted = false; // indicate that the component is unmounted
    };
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        const position = index - currentIndex;
        const inputRange = [-screenWidth, 0, screenWidth];
        const offsetX = translateX.interpolate({
          inputRange,
          outputRange: inputRange.map(val => val + position * screenWidth),
        });
        return (
          <Animated.View
            key={item.id}
            style={[
              styles.animatedViewStyle,
              {
                transform: [{ translateX: offsetX }],
              },
            ]}>
            <Typography.Text size="body" weight="bold" align="center" style={{ marginBottom: 12 }}>
              {item.title}
            </Typography.Text>
            <Typography.Text size="callout" align="center">
              {item.description}
            </Typography.Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  animatedViewStyle: {
    position: "absolute",
    width: "60%",
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
