import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ArrowLeftIcon({ width = 24, height = 24, color = "black" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill={color} />
    </Svg>
  );
}
