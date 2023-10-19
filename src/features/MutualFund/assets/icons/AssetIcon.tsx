import * as React from "react";
import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export default function AssetIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M15 4C10.58 4 7 7.58 7 12C7 16.42 10.58 20 15 20C19.42 20 23 16.42 23 12C23 7.58 19.42 4 15 4ZM15 18C11.69 18 9 15.31 9 12C9 8.69 11.69 6 15 6C18.31 6 21 8.69 21 12C21 15.31 18.31 18 15 18ZM3 12C3 9.39 4.67 7.17 7 6.35V4.26C3.55 5.15 1 8.27 1 12C1 15.73 3.55 18.85 7 19.74V17.65C4.67 16.83 3 14.61 3 12Z"
        fill={color}
      />
    </Svg>
  );
}
