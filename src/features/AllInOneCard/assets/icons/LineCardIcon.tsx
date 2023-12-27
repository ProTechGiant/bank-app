import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function LineCardIcon({ width = 315, height = 1, color = "#9291A1" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 315 1" fill="none">
      <Path d="M0 0.5H315" stroke={color} stroke-dasharray="4 4" />
    </Svg>
  );
}
