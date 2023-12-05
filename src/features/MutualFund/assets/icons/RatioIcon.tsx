import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function RatioIcon({ width = 16, height = 16, color = "#39FDDC" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M13.334 6.28V8h1.333V4h-4v1.333h1.72L9.414 8.307c-.26.26-.68.26-.94 0l-.78-.78a2 2 0 00-2.827 0L1.333 11.06l.94.94L5.8 8.473c.26-.26.68-.26.94 0l.78.78a2 2 0 002.827 0l2.987-2.973z"
        fill={color}
      />
    </Svg>
  );
}
