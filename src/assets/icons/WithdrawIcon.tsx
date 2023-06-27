import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function WithdrawIcon({ width = 24, height = 24, color = "#002233" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M17 17L22 12L17 7L15.59 8.41L18.17 11H9V13H18.17L15.59 15.59L17 17Z" fill={color} />
      <Path
        d="M19 19H5V5H19V7H21V5C21 3.9 20.11 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.11 21 21 20.1 21 19V17H19V19Z"
        fill={color}
      />
    </Svg>
  );
}
