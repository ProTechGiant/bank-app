import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ChevronBottomIcon({ color = "#FF5B00", height = 24, width = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M7.41 8.29688L12 12.8769L16.59 8.29688L18 9.70687L12 15.7069L6 9.70687L7.41 8.29688Z" fill={color} />
    </Svg>
  );
}
