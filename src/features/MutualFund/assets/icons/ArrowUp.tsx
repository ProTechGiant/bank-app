import * as React from "react";
import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export default function ArrowUp({ width = 12, height = 13, color = "#00AC86" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M0 6.5L1.0575 7.5575L5.25 3.3725V12.5H6.75V3.3725L10.935 7.565L12 6.5L6 0.5L0 6.5Z" fill={color} />
    </Svg>
  );
}
