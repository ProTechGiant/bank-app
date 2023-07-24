import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function FilterListIcon({ width = 24, height = 24, color = "black" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 25" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path d="M10 18.5H14V16.5H10V18.5ZM3 6.5V8.5H21V6.5H3ZM6 13.5H18V11.5H6V13.5Z" fill="black" />
    </Svg>
  );
}
