import Svg, { Circle } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function EllipseIcon({ width = 6, height = 5, color = "#FAFAFA" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 6 5" fill="none">
      <Circle cx="3" cy="2.5" r="2.5" fill={color} />
    </Svg>
  );
}
