import React from "react";
import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

interface GenericSvgIconType extends IconProps {
  path: string;
  viewBox?: string;
}

export default function GenericSvgIcon({
  width = 19,
  height = 18,
  color = "#B3B3B3",
  path,
  viewBox = "0 0 20 20",
}: GenericSvgIconType) {
  return (
    <Svg width={width} height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d={path} fill={color} />
    </Svg>
  );
}
