import React from "react";
import { Path, Svg } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export function CircleIcon({ height = 12, width = 12, color = "#FAFAFA" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/Svg">
      <Path
        d="M6 1C3.235 1 1 3.235 1 6C1 8.765 3.235 11 6 11C8.765 11 11 8.765 11 6C11 3.235 8.765 1 6 1ZM6 10C3.79 10 2 8.21 2 6C2 3.79 3.79 2 6 2C8.21 2 10 3.79 10 6C10 8.21 8.21 10 6 10Z"
        fill={color}
      />
    </Svg>
  );
}
