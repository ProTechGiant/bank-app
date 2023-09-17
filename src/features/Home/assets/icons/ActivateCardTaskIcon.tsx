import * as React from "react";
import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export default function ActivateCardTaskIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M19 3H3c-1.11 0-1.99.89-1.99 2L1 17c0 1.11.89 2 2 2h10v-2H3v-6h18V5c0-1.11-.89-2-2-2zm0 4H3V5h16v2zm4 9v2h-3v3h-2v-3h-3v-2h3v-3h2v3h3z"
        fill={color}
      />
    </Svg>
  );
}
