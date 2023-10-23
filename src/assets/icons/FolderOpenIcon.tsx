import React from "react";
import Svg, { G, Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export function FolderOpenIcon({ width = 25, height = 24, color = "#080E53" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G id="folder_open">
        <Path
          id="Vector"
          d="M20.5 6H12.5L10.5 4H4.5C3.4 4 2.51 4.9 2.51 6L2.5 18C2.5 19.1 3.4 20 4.5 20H20.5C21.6 20 22.5 19.1 22.5 18V8C22.5 6.9 21.6 6 20.5 6ZM20.5 18H4.5V8H20.5V18Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
