import * as React from "react";
import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export function LifestyleIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M1.5 4.5h14l-6 9v4h2v2h-6v-2h2v-4l-6-9zm9.1 4l1.4-2H4.99l1.4 2h4.21zm6.9-4h5v3h-3v9c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3a3 3 0 011 .17V4.5z"
        fill={color}
      />
    </Svg>
  );
}
