import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function Flag({ width = 24, height = 24, color = "#00A0CC" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M13.9 5.5L13.5 3.5H4.5V20.5H6.5V13.5H12.1L12.5 15.5H19.5V5.5H13.9Z" fill={color} />
    </Svg>
  );
}
