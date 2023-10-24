import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ChevronUpIcon({ color = "#FF5B00", height = 24, width = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M7.41 15.7069L12 11.1269L16.59 15.7069L18 14.2969L12 8.29688L6 14.2969L7.41 15.7069Z" fill={color} />
    </Svg>
  );
}
