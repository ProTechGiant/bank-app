import { Path, Svg } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function TransferHorizontalIcon({ color = "#FF7512", height = 24, width = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M7.41 13.41L6 12L2 16L6 20L7.41 18.59L5.83 17H21V15H5.83L7.41 13.41Z" fill={color} />
      <Path d="M16.59 10.59L18 12L22 8L18 4L16.59 5.41L18.17 7H3V9H18.17L16.59 10.59Z" fill={color} />
    </Svg>
  );
}
