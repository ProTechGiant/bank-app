import { Path, Svg } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export function TickIcon({ width = 14, height = 11, color = "#FF7512" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M2 4.86L5.42105 8.5L12 1.5" stroke={color} stroke-width="3" stroke-linecap="round" />
    </Svg>
  );
}
