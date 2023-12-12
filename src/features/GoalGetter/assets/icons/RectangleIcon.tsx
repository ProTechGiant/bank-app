import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function RectangleIcon({ width = 13, height = 11, color = "#02CAAA" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M0 10.8L6.5 0L13 10.8H0Z" fill={color} />
    </Svg>
  );
}
