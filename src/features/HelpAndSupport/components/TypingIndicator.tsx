import React, { memo, useEffect } from "react";
import { Animated, Easing } from "react-native";

import Stack from "@/components/Stack";

import { ChatTypingIcon } from "../assets/icons";

const DOT_MOVE_DISTANCE = 6;
const STAGGER_DELAY = 250;

const TypingIndicator = () => {
  const dotAnimations = [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)];

  const animateDots = () => {
    const animations = dotAnimations.map(dotY =>
      Animated.sequence([
        Animated.timing(dotY, {
          toValue: -DOT_MOVE_DISTANCE,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(dotY, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(STAGGER_DELAY, animations).start(() => {
      animateDots();
    });
  };

  useEffect(() => {
    animateDots();

    return () => {
      dotAnimations.forEach(dotY => dotY.setValue(0));
    };
  }, []);

  return (
    <Stack direction="horizontal">
      {dotAnimations.map((dotY, index) => (
        <Animated.View key={index} style={{ transform: [{ translateY: dotY }] }}>
          <ChatTypingIcon />
        </Animated.View>
      ))}
    </Stack>
  );
};

export default memo(TypingIndicator);
