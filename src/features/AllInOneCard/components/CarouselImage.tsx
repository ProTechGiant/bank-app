import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

interface CarouselImageProps {
  data: {
    img: JSX.Element;
    title: string;
    description: string;
    id: number;
  }[];
}

export default function CarouselImage({ data }: CarouselImageProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Interpolate opacity value based on translateY value.
  const opacity = translateY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  useEffect(() => {
    let isMounted = true;
    // Image Animation
    const imageAnimationSequence = Animated.sequence([
      Animated.timing(translateY, {
        toValue: 120,
        duration: 1100,
        useNativeDriver: true,
      }),
      // Change index when the image has moved up
      Animated.timing(translateY, {
        toValue: 120, // Keep the value the same. This is a trick to execute a side effect without animating
        duration: 400,
        useNativeDriver: true,
      }),
      // Move the image down
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]);

    // Start the image animation sequence
    imageAnimationSequence.start(() => {
      if (isMounted) {
        setCurrentIndex((currentIndex + 1) % data.length);
      } // Move to the next index after the sequence is completed.
    });
    return () => {
      isMounted = false; // indicate that the component is unmounted
      imageAnimationSequence.stop(); // Stop the animation sequence
    };
  }, [currentIndex]);

  const containerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing["48p"],
  }));

  return (
    <View style={containerViewStyle}>
      {data.map((item, index) => {
        return (
          <Animated.View
            key={item.id}
            style={[
              styles.animatedViewStyle,
              {
                top: index === currentIndex ? 0 : 10000, // Hide images other than current one
                transform: [{ translateY: index === currentIndex ? translateY : 0 }],
                opacity: index === currentIndex ? opacity : 1, // Use the interpolated opacity here
              },
            ]}>
            {item.img}
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  animatedViewStyle: {
    position: "absolute",
  },
});
