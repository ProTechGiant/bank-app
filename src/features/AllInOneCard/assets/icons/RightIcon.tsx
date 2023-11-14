import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function RightIcon({ width = 24, height = 24, color = "#B3B3B3" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M9.70687 6L8.29688 7.41L12.8769 12L8.29688 16.59L9.70687 18L15.7069 12L9.70687 6Z" fill={color} />
    </Svg>
  );
}
