import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const BackIcon = ({ width = 16, height = 16, color = "black" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
    <Path d="M16 7H3.83L9.42 1.41L8 0L0 8L8 16L9.41 14.59L3.83 9H16V7Z" fill={color} />
  </Svg>
);

export { BackIcon };
