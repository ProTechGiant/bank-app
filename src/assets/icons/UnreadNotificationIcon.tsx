import Svg, { Circle } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export function UnreadNotificationIcon({ width = 6, height = 6, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Circle cx="3" cy="3" r="3" fill={color} />
    </Svg>
  );
}
