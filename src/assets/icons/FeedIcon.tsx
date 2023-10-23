import React from "react";
import Svg, { G, Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export function FeedIcon({ width = 24, height = 24, color = "#080E53" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G id="feed">
        <Path
          id="Vector"
          d="M16 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V8L16 3ZM19 19H5V5H15V9H19V19ZM7 17H17V15H7V17ZM12 7H7V9H12V7ZM7 13H17V11H7V13Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
