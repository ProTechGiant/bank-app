import React, { useRef, useState } from "react";
import { Animated, PanResponder, View, ViewStyle } from "react-native";

import { Stack } from "@/components";
import { useThemeStyles } from "@/theme";

import { CardData } from "../../types";
import DetailsList from "./DetailsList";

interface ShowCardDetailsProps {
  visaData: CardData;
}

export default function ShowCardDetails({ visaData }: ShowCardDetailsProps) {
  const [marginTopAnim] = useState(new Animated.Value(0));
  const [marginAnim] = useState(new Animated.Value(0));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        marginAnim.setOffset(marginTopAnim._value);
      },
      onPanResponderMove: (e, gestureState) => {
        const newMarginTop = marginAnim._offset + gestureState.dy;
        const clampedMarginTop = Math.max(-180, Math.min(newMarginTop, 0));
        marginTopAnim.setValue(clampedMarginTop);
      },
      onPanResponderRelease: () => {
        marginTopAnim.flattenOffset();
        const finalValue = marginTopAnim._value < -90 ? -180 : 0;
        Animated.spring(marginTopAnim, {
          toValue: finalValue,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: "white",
    borderTopRightRadius: theme.radii.xlarge,
    borderTopLeftRadius: theme.radii.xlarge,
    flex: 1,
    marginTop: marginTopAnim, // Animated top margin
    overflow: "hidden",
  }));

  const pressableViewStyle = useThemeStyles<ViewStyle>(theme => ({
    width: 61,
    height: 6,
    borderRadius: theme.radii.medium,
    backgroundColor: theme.palette["neutralBase-30"],
  }));

  const pressableContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["12p"],
    paddingBottom: theme.spacing["16p"],
    alignItems: "center",
  }));

  return (
    <Animated.View style={containerStyle}>
      <Animated.View style={pressableContainerStyle} {...panResponder.panHandlers}>
        <View style={pressableViewStyle} />
      </Animated.View>
      <Stack direction="vertical" flex={1} justify="space-between">
        <DetailsList details={visaData} />
      </Stack>
    </Animated.View>
  );
}
