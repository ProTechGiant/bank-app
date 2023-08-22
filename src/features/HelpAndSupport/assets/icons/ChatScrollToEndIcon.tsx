import * as React from "react";
import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export default function ChatScrollToEndIcon({ width = 24, height = 24, color = "#2E2E2E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M18 6.41L16.59 5 12 9.58 7.41 5 6 6.41l6 6 6-6z" fill={color} />
      <Path d="M18 13l-1.41-1.41L12 16.17l-4.59-4.58L6 13l6 6 6-6z" fill={color} />
    </Svg>
  );
}
