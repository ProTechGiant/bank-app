import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

import { IconProps } from ".";

export function TrendingUpIcon({ color = "#00A0CC", height = 24, width = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect width="44" height="44" rx="22" fill="#F5F5F5" />
      <Path
        d="M25.3337 17L27.242 18.9083L23.1753 22.975L19.842 19.6417L13.667 25.825L14.842 27L19.842 22L23.1753 25.3333L28.4253 20.0917L30.3337 22V17H25.3337Z"
        fill={color}
      />
    </Svg>
  );
}
