import React from "react";
import { StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
interface StatusBarProps {
  backgroundColor?: string;
  barStyle?: "dark-content" | "light-content";
}

export default function CustomStatusBar({ backgroundColor, barStyle = "dark-content" }: StatusBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ height: insets.top, backgroundColor }}>
      <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} animated={true} translucent />
    </View>
  );
}
