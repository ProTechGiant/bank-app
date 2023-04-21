import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function FilterIcon({ width = 54, height = 44, color = "#2E2E2E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 54 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M25 28H29V26H25V28ZM18 16V18H36V16H18ZM21 23H33V21H21V23Z" fill={color} />
    </Svg>
  );
}
