import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ArrowIcon({ width = 24, height = 25, color = "#B3B3B3" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M9.70687 6.5L8.29688 7.91L12.8769 12.5L8.29688 17.09L9.70687 18.5L15.7069 12.5L9.70687 6.5Z"
        fill={color}
      />
    </Svg>
  );
}
