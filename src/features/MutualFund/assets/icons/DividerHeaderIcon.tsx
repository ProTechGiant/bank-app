import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function DividerHeaderIcon({ width = 389, height = 23, color = "#002233" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 390 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M390 24.8008L3.05176e-05 9.60249L0 0.800781L390 0.800781L390 24.8008Z" fill={color} />
    </Svg>
  );
}
