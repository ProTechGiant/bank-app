import Svg, { Path, Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function NavigateToAccountIcon({ width = 36, height = 36, color = "#2E2E2E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect y={0.799805} width={36} height={36} rx={18} fill="#FAFAFA" fillOpacity={0.6} />
      <Path d="M15.705 12.8l-1.41 1.41 4.58 4.59-4.58 4.59 1.41 1.41 6-6-6-6z" fill={color} />
    </Svg>
  );
}
