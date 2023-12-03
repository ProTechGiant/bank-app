import * as React from "react";
import Svg, { Line } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export default function LineCardSection({ width = 1, height = 43, color = "#D4D4DE" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 1 43" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Line x1="0.5" y1="-2.18556e-08" x2="0.500002" y2="43" stroke={color} />
    </Svg>
  );
}
