import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ChevronLeftIcon({ color = "#FF5B00", height = 24, width = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M15.7069 7.41L14.2969 6L8.29688 12L14.2969 18L15.7069 16.59L11.1269 12L15.7069 7.41Z" fill={color} />
    </Svg>
  );
}
