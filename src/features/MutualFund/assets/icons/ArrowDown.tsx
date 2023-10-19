import * as React from "react";
import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export default function ArrowDown({ width = 12, height = 13, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M12 6.5L10.9425 5.4425L6.75 9.6275L6.75 0.5H5.25L5.25 9.6275L1.065 5.435L0 6.5L6 12.5L12 6.5Z"
        fill={color}
      />
    </Svg>
  );
}
