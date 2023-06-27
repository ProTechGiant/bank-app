import React from "react";
import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function RemoveIcon({ width = 10, height = 16, color = "black" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M9.94006 1.88L8.06006 0L0.0600586 8L8.06006 16L9.94006 14.12L3.83339 8L9.94006 1.88Z" fill={color} />
    </Svg>
  );
}
