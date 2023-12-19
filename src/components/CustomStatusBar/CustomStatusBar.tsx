import React from "react";
import { StatusBar, View } from "react-native";
interface StatusBarProps {
  backgroundColor?: string;
  barStyle?: "dark-content" | "light-content";
}

export default function CustomStatusBar({ backgroundColor, barStyle = "dark-content" }: StatusBarProps) {
  return (
    <View style={{ backgroundColor }}>
      <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} animated={true} translucent />
    </View>
  );
}
