import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function DividerHeaderHomeIcon({ width = 389, height = 23, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 389 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M390 24.7998L3.05176e-05 9.60151L0 0.799805L390 0.799805L390 24.7998Z" fill={color} />
    </Svg>
  );
}
