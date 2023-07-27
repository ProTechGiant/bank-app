import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function AngleDownIcon({ color = "#B3B3B3", height = 24, width = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M16.59 8.795L12 13.375l-4.59-4.58L6 10.205l6 6 6-6-1.41-1.41z" fill={color} />
    </Svg>
  );
}
