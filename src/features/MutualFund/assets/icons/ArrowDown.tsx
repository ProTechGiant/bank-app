import * as React from "react";
import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export default function ArrowDown({ width = 20, height = 20, color = "#F5F9FA" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M13.825 6.9126L10 10.7293L6.175 6.9126L5 8.0876L10 13.0876L15 8.0876L13.825 6.9126Z" fill={color} />
    </Svg>
  );
}
