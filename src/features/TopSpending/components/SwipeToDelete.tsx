import React from "react";
import { Animated, I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { DeleteIcon } from "@/assets/icons";
import { useThemeStyles } from "@/theme";

declare type AnimatedInterpolation = ReturnType<Animated.Value["interpolate"]>;
interface SwipeToDeleteProps {
  handleOnDeletePress: () => void;
  children: React.ReactNode;
}

export default function SwipeToDelete({ children, handleOnDeletePress }: SwipeToDeleteProps) {
  const deleteButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: "white",
    height: "100%",
    justifyContent: "center",
    borderColor: theme.palette.errorBase,
    borderWidth: 1,
    borderRadius: theme.radii.small,
    marginLeft: theme.spacing["32p"],
    width: 58,
  }));

  const renderRightActions = (dragX: AnimatedInterpolation) => {
    dragX.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [0, 10, 50],
    });

    return (
      <View style={deleteButtonStyle}>
        <Pressable onPress={handleOnDeletePress} style={styles.swipeButton}>
          <DeleteIcon color="#C50707" />
        </Pressable>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={(dragX: AnimatedInterpolation) => (I18nManager.isRTL ? null : renderRightActions(dragX))}
      renderLeftActions={(dragX: AnimatedInterpolation) => (I18nManager.isRTL ? renderRightActions(dragX) : null)}
      overshootRight={false}
      overshootLeft={false}>
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  swipeButton: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
});
