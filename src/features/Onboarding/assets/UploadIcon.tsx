import React from "react";
import { G, Path, Svg } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export function UploadIcon({ height = 24, width = 24, color = "#B3B3B3" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/Svg">
      <G id="upload">
        <Path id="Vector" d="M5 20.5H19V18.5H5V20.5ZM5 10.5H9V16.5H15V10.5H19L12 3.5L5 10.5Z" fill={color} />
      </G>
    </Svg>
  );
}
